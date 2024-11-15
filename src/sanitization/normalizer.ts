import {Hotel, StandardizedHotelData} from '../models/Hotel';

type NormalizationStrategy = (value: any, context?: Partial<StandardizedHotelData>) => any;

const normalizationStrategies: { [key: string]: NormalizationStrategy } = {
    // Image-specific normalization
    images: (value: string[] | null) => (Array.isArray(value) ? value.map((description: string) => cleanString(description)) : []),

    // Address normalization
    address: (value: string | null, context?: Partial<StandardizedHotelData>) =>
        value ? formatAddress(value, context?.name || '', context?.city || '', context?.postalCode || '') : '',

    // Country/City specific case normalization
    country: (value: string | null) => value ? specificName(value) : '',
    city: (value: string | null) => value ? specificName(value) : '',
    name: (value: string | null) => value ? specificName(value) : '',

    // General amenities and room amenities
    generalAmenities: (value: string[] | null) => (Array.isArray(value) ? value.map((item: string) => cleanString(item.toLowerCase())) : []),
    roomAmenities: (value: string[] | null) => (Array.isArray(value) ? value.map((item: string) => cleanString(item.toLowerCase())) : []),

    // Booking conditions, taking every third item
    booking_conditions: (value: string[] | null) => (Array.isArray(value) ? cleanParagraph(value.slice(0, 3)) : []),

    //description normalization
    description: (value: string | null) => {
        if (!value) return '';
        const firstSentence = value.split('.')[0];
        return cleanSentence(firstSentence);
    },

    // Default string normalization
    defaultString: (value: string) => cleanSentence(value),

    // Default array normalization
    defaultArray: (value: string[] | null) => (Array.isArray(value) ? cleanParagraph(value) : []),
};

export function normalizeData(hotels: StandardizedHotelData[]): StandardizedHotelData[] {
    return hotels.map(hotel => {
        const normalizedHotel: Partial<StandardizedHotelData> = {};

        // Step 1: Exclude empty values consistently
        for (const [key, value] of Object.entries(hotel)) {
            normalizedHotel[key] = (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) ? value : null;
        }

        // Step 2: Apply selective normalization based on data type or field requirements
        for (const [key, value] of Object.entries(normalizedHotel)) {
            if (key.includes("Images") && Array.isArray(value)) {
                normalizedHotel[key] = normalizationStrategies.images(value);
            } else if (key === "address") {
                // For address, pass in the context to allow for city, country, and postal code normalization
                normalizedHotel[key] = normalizationStrategies.address(value, normalizedHotel);
            } else if (normalizationStrategies[key]) {
                // Use specific strategy if available
                normalizedHotel[key] = normalizationStrategies[key](value);
            } else if (typeof value === "string") {
                // Use default string normalization
                normalizedHotel[key] = normalizationStrategies.defaultString(value);
            } else if (Array.isArray(value)) {
                // Use default array normalization
                normalizedHotel[key] = normalizationStrategies.defaultArray(value);
            }
        }

        return normalizedHotel as StandardizedHotelData;
    });
}

// Helper Functions

function cleanString(value: string): string {
    if (typeof value === 'string') {
        return value.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
    }
    return value;
}

function cleanArrayString(arr: string[]): string[] {
    return arr.map(item => typeof item === "string" ? cleanString(item) : item);
}

function cleanSentence(value: string): string {
    if( typeof value === 'string') {
        value.replace(/[^a-zA-Z0-9. ]/g, '').replace(/\s+/g, ' ').trim();
        value.replace(/(^\w{1}|\.\s*\w{1})/g, (match) => match.toUpperCase());
    }
    return value
}

function cleanParagraph(value: string[]): string[] {
    return value.map(sentence => cleanSentence(sentence));
}

function specificName(value: string): string {
    return value.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatAddress(rawAddress: string, name?: string, city?: string, postalCode?: string): string {
    // Split the raw address by commas and trim whitespace
    const addressParts = rawAddress.split(',').map(part => part.trim());
    let street = '';
    let place = '';
    let postal = '';

    addressParts.forEach(part => {
        if (/^\d+[-\s]?\d*$/.test(part)) {
            postal = cleanString(part);
        } else if (/\d/.test(part) && /[a-zA-Z]/.test(part)) {
            street = part;
        } else if (/[a-zA-Z]/.test(part)) {
            place = specificName(cleanString(part));
        }
    });

    postal = postal || cleanString(postalCode || '');

    let formattedStreet = '';
    for (let i = 0; i < street.length; i++) {
        if (street[i] === '-') {
            if (i > 0 && /\d/.test(street[i - 1]) && i < street.length - 1 && /\d/.test(street[i + 1])) {
                // If current character is hyphen and both previous and next characters are numbers, remove hyphen
                continue;
            } else if (i > 0 && /[a-zA-Z]/.test(street[i - 1]) && i < street.length - 1 && /[a-zA-Z]/.test(street[i + 1])) {
                // If current character is hyphen and both previous and next characters are letters, replace hyphen with space
                formattedStreet += ' ';
                continue;
            }
        }
        formattedStreet += street[i];
    }
    street = specificName(cleanString(formattedStreet));

    if (name && city) {
        const nameParts = name.split(' ');
        const cityParts = city.split(' ');

        place = nameParts
            .filter(word => !cityParts.includes(word))
            .join(' ');

        place = specificName(place);
    }else{
        place = specificName(place);
    }

    return [street, place, postal].filter(part => part).join(', ');
}
