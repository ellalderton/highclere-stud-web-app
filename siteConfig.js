/*
    To enable us to whitelabel parts of the app.
    Use these to customise the app.
 */


export const brandDetails = {
    name: 'Highclere Stud',
    slug: 'highclere-stud'
}

export const horseFilters = {
    age: {
        options: [
            { value: null, text: 'All' },
            { value: 0, text: 'Foal' },
            { value: 1, text: 'Yearling' },
            { value: 2, text: '2 Years' },
            { value: 3, text: '3 Years' },
            { value: 4, text: '4 Years' },
            { value: 5, text: '5 Years' },
            { value: '+6', text: '6+ Years' }
        ]
    },
    colours: {
        options: [
            { value: null, text: 'All' },
            { value: 'bay', text: 'Bay' },
            { value: 'black', text: 'Black' },
            { value: 'brown', text: 'Brown' },
            { value: 'chesnut', text: 'Chesnut' },
            { value: 'grey', text: 'Grey' },
            { value: 'roan', text: 'Roan' }
        ]
    },
    gender: {
        options: [
            { value: null, text: 'All' },
            { value: 'colt', text: 'Colt' },
            { value: 'filly', text: 'Filly' },
            { value: 'gelding', text: 'Gelding' },
        ]
    },
    pregnancy_status: {
        options: [
            { value: null, text: 'All' },
            { value: 1, text: 'Died Since Birth' },
            { value: 2, text: 'Early Abortion' },
            { value: 3, text: 'Not Covered' },
            { value: 4, text: 'Dead Foal' },
            { value: 5, text: 'Visiting' },
            { value: 6, text: 'In Foal' },
            { value: 7, text: 'Covered' },
            { value: 8, text: 'Maiden' },
            { value: 9, text: 'Barren' },
            { value: 10, text: 'Slipped' },
        ]
    }
}

export const entryFilters = {}

export const attachmentTypes = [
    {
        name: 'Audio', type: 'audio'
    },
    {
        name: 'Audio URL', type: 'audio-url'
    },
    {
        name: 'Video', type: 'video'
    },
    {
        name: 'Video URL', type: 'video-url'
    },
    {
        name: 'Image', type: 'image'
    },
    {
        name: 'Document', type: 'document'
    }
];