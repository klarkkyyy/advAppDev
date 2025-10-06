export interface Song {
    id: string;
    title: string;
    artist: string;
    duration: string;
}

export const playlistSongs: { [key: string]: Song[] } = {
    "1": [ // Chill Vibes
        { id: "1-1", title: "Waves", artist: "Lo-Fi Beats", duration: "3:45" },
        { id: "1-2", title: "Sunset Dreams", artist: "Chill Avenue", duration: "4:20" },
        { id: "1-3", title: "Midnight Peace", artist: "Ambient Flow", duration: "5:15" },
        { id: "1-4", title: "Calm Waters", artist: "Nature Sounds", duration: "6:30" },
        { id: "1-5", title: "Gentle Rain", artist: "Sleep Easy", duration: "4:55" }
    ],
    "2": [ // Workout
        { id: "2-1", title: "Power Up", artist: "Gym Heroes", duration: "3:30" },
        { id: "2-2", title: "No Pain No Gain", artist: "Fitness Beats", duration: "4:15" },
        { id: "2-3", title: "Keep Moving", artist: "Workout Kings", duration: "3:45" },
        { id: "2-4", title: "Push It", artist: "Exercise Nation", duration: "4:00" },
        { id: "2-5", title: "Last Rep", artist: "Muscle Music", duration: "3:50" }
    ],
    "3": [ // Top Hits
        { id: "3-1", title: "Dance Tonight", artist: "Pop Stars", duration: "3:30" },
        { id: "3-2", title: "Summer Love", artist: "Beach Boys", duration: "4:15" },
        { id: "3-3", title: "City Lights", artist: "Urban Sound", duration: "3:45" },
        { id: "3-4", title: "Heart Beat", artist: "The Rhythm", duration: "4:00" },
        { id: "3-5", title: "Midnight Drive", artist: "Night Owls", duration: "3:50" }
    ],
    "4": [ // Indie
        { id: "4-1", title: "Coffee Shop", artist: "Acoustic Dreams", duration: "4:20" },
        { id: "4-2", title: "Vintage Vinyl", artist: "The Locals", duration: "3:45" },
        { id: "4-3", title: "Street Art", artist: "Urban Poets", duration: "5:10" },
        { id: "4-4", title: "Thrift Store", artist: "Hipster Band", duration: "4:30" },
        { id: "4-5", title: "Polaroid", artist: "Film Camera", duration: "3:55" }
    ],
    "5": [ // Jazz
        { id: "5-1", title: "Blue Moon", artist: "Jazz Quartet", duration: "6:15" },
        { id: "5-2", title: "Smooth Sax", artist: "Night Club", duration: "5:30" },
        { id: "5-3", title: "Piano Dreams", artist: "Keys Master", duration: "4:45" },
        { id: "5-4", title: "Bass Solo", artist: "Deep Rhythm", duration: "7:00" },
        { id: "5-5", title: "Trumpet Gold", artist: "Brass Band", duration: "5:20" }
    ],
    "6": [ // Classical
        { id: "6-1", title: "Moonlight", artist: "String Orchestra", duration: "8:30" },
        { id: "6-2", title: "Symphony No. 5", artist: "City Philharmonic", duration: "9:15" },
        { id: "6-3", title: "Piano Concerto", artist: "Grand Piano", duration: "7:45" },
        { id: "6-4", title: "Violin Dreams", artist: "Solo Strings", duration: "6:20" },
        { id: "6-5", title: "Opera Night", artist: "Royal Orchestra", duration: "10:00" }
    ],
    "7": [ // Hip Hop
        { id: "7-1", title: "Street Beat", artist: "Urban Flow", duration: "3:45" },
        { id: "7-2", title: "City Rhythm", artist: "Beat Masters", duration: "4:20" },
        { id: "7-3", title: "Flow State", artist: "Rhyme Time", duration: "3:30" },
        { id: "7-4", title: "Bass Drop", artist: "Sound System", duration: "4:15" },
        { id: "7-5", title: "Mic Check", artist: "Fresh Beats", duration: "3:55" }
    ]
};