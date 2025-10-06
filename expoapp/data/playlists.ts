export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl?: string; // For actual playback
}

export interface PlaylistData {
  [key: string]: Song[];
}

export const playlistSongs: PlaylistData = {
  '1': [ // Chill Vibes
    { id: '1', title: 'Floating', artist: 'James Vincent McMorrow', duration: '3:25', audioUrl: 'https://example.com/floating.mp3' },
    { id: '2', title: 'Coffee', artist: 'Beabadoobee', duration: '3:45', audioUrl: 'https://example.com/coffee.mp3' },
    { id: '3', title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '4:10', audioUrl: 'https://example.com/sunset.mp3' },
    { id: '4', title: 'Featherlight', artist: 'Tycho', duration: '4:35', audioUrl: 'https://example.com/featherlight.mp3' },
    { id: '5', title: 'Within', artist: 'Daft Punk', duration: '3:48', audioUrl: 'https://example.com/within.mp3' },
  ],
  '2': [ // Workout
    { id: '1', title: 'Till I Collapse', artist: 'Eminem', duration: '4:57', audioUrl: 'https://example.com/collapse.mp3' },
    { id: '2', title: 'Stronger', artist: 'Kanye West', duration: '5:11', audioUrl: 'https://example.com/stronger.mp3' },
    { id: '3', title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:05', audioUrl: 'https://example.com/tiger.mp3' },
    { id: '4', title: 'Can\'t Hold Us', artist: 'Macklemore & Ryan Lewis', duration: '4:18', audioUrl: 'https://example.com/canthold.mp3' },
    { id: '5', title: 'Gonna Fly Now', artist: 'Bill Conti', duration: '2:48', audioUrl: 'https://example.com/rocky.mp3' },
  ],
  '3': [ // Top Hits
    { id: '1', title: 'Cruel Summer', artist: 'Taylor Swift', duration: '2:58', audioUrl: 'https://example.com/cruel.mp3' },
    { id: '2', title: 'Paint The Town Red', artist: 'Doja Cat', duration: '3:50', audioUrl: 'https://example.com/paint.mp3' },
    { id: '3', title: 'Rich Flex', artist: 'Drake & 21 Savage', duration: '3:22', audioUrl: 'https://example.com/rich.mp3' },
    { id: '4', title: 'Vampire', artist: 'Olivia Rodrigo', duration: '3:39', audioUrl: 'https://example.com/vampire.mp3' },
    { id: '5', title: 'Last Night', artist: 'Morgan Wallen', duration: '2:44', audioUrl: 'https://example.com/last.mp3' },
  ],
  '4': [ // Indie
    { id: '1', title: 'Motion Sickness', artist: 'Phoebe Bridgers', duration: '3:58', audioUrl: 'https://example.com/motion.mp3' },
    { id: '2', title: 'Scott Street', artist: 'Phoebe Bridgers', duration: '5:05', audioUrl: 'https://example.com/scott.mp3' },
    { id: '3', title: 'Two Slow Dancers', artist: 'Mitski', duration: '4:34', audioUrl: 'https://example.com/dancers.mp3' },
    { id: '4', title: 'This Must Be the Place', artist: 'Sure Sure', duration: '3:45', audioUrl: 'https://example.com/place.mp3' },
    { id: '5', title: 'Coffee', artist: 'beabadoobee', duration: '3:45', audioUrl: 'https://example.com/coffee-bea.mp3' },
  ],
  '5': [ // Jazz
    { id: '1', title: 'Take Five', artist: 'Dave Brubeck', duration: '5:24', audioUrl: 'https://example.com/take5.mp3' },
    { id: '2', title: 'So What', artist: 'Miles Davis', duration: '9:22', audioUrl: 'https://example.com/what.mp3' },
    { id: '3', title: 'Blue in Green', artist: 'Miles Davis', duration: '5:37', audioUrl: 'https://example.com/blue.mp3' },
    { id: '4', title: 'Round Midnight', artist: 'Thelonious Monk', duration: '6:41', audioUrl: 'https://example.com/midnight.mp3' },
    { id: '5', title: 'My Favorite Things', artist: 'John Coltrane', duration: '13:41', audioUrl: 'https://example.com/things.mp3' },
  ],
  '6': [ // Classical Essentials
    { id: '1', title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven', duration: '15:00', audioUrl: 'https://example.com/moonlight.mp3' },
    { id: '2', title: 'Für Elise', artist: 'Ludwig van Beethoven', duration: '3:35', audioUrl: 'https://example.com/elise.mp3' },
    { id: '3', title: 'Claire de Lune', artist: 'Claude Debussy', duration: '5:00', audioUrl: 'https://example.com/claire.mp3' },
    { id: '4', title: 'The Four Seasons - Spring', artist: 'Antonio Vivaldi', duration: '10:31', audioUrl: 'https://example.com/spring.mp3' },
    { id: '5', title: 'Symphony No. 5', artist: 'Ludwig van Beethoven', duration: '7:24', audioUrl: 'https://example.com/fifth.mp3' },
  ],
  '7': [ // Hip Hop Beats
    { id: '1', title: 'Alright', artist: 'Kendrick Lamar', duration: '3:39', audioUrl: 'https://example.com/alright.mp3' },
    { id: '2', title: 'God\'s Plan', artist: 'Drake', duration: '3:18', audioUrl: 'https://example.com/gods.mp3' },
    { id: '3', title: 'Sicko Mode', artist: 'Travis Scott', duration: '5:12', audioUrl: 'https://example.com/sicko.mp3' },
    { id: '4', title: 'DNA.', artist: 'Kendrick Lamar', duration: '3:05', audioUrl: 'https://example.com/dna.mp3' },
    { id: '5', title: 'HUMBLE.', artist: 'Kendrick Lamar', duration: '2:57', audioUrl: 'https://example.com/humble.mp3' },
  ],
  '8': [ // Party Mix
    { id: '1', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: '4:30', audioUrl: 'https://example.com/uptown.mp3' },
    { id: '2', title: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', duration: '4:52', audioUrl: 'https://example.com/dance.mp3' },
    { id: '3', title: 'Don\'t Stop Believin\'', artist: 'Journey', duration: '4:11', audioUrl: 'https://example.com/dont.mp3' },
    { id: '4', title: 'Hey Ya!', artist: 'OutKast', duration: '3:55', audioUrl: 'https://example.com/heya.mp3' },
    { id: '5', title: 'September', artist: 'Earth, Wind & Fire', duration: '3:35', audioUrl: 'https://example.com/september.mp3' },
  ],
  '9': [ // Acoustic Mornings
    { id: '1', title: 'Banana Pancakes', artist: 'Jack Johnson', duration: '3:11', audioUrl: 'https://example.com/banana.mp3' },
    { id: '2', title: 'Your Song', artist: 'Elton John', duration: '4:03', audioUrl: 'https://example.com/your.mp3' },
    { id: '3', title: 'Fast Car', artist: 'Tracy Chapman', duration: '4:56', audioUrl: 'https://example.com/car.mp3' },
    { id: '4', title: 'Redemption Song', artist: 'Bob Marley', duration: '3:48', audioUrl: 'https://example.com/redemption.mp3' },
    { id: '5', title: 'Wonderwall', artist: 'Oasis', duration: '4:18', audioUrl: 'https://example.com/wonder.mp3' },
  ],
  '10': [ // Lo-fi Study
    { id: '1', title: 'Midnight in Tokyo', artist: 'Sweet Trip', duration: '3:15', audioUrl: 'https://example.com/tokyo.mp3' },
    { id: '2', title: 'Snowman', artist: 'WYS', duration: '2:44', audioUrl: 'https://example.com/snowman.mp3' },
    { id: '3', title: 'Pure Imagination', artist: 'Nujabes', duration: '4:01', audioUrl: 'https://example.com/pure.mp3' },
    { id: '4', title: 'Dusk to Dawn', artist: 'Emancipator', duration: '5:05', audioUrl: 'https://example.com/dusk.mp3' },
    { id: '5', title: 'Time Moves Slow', artist: 'BADBADNOTGOOD', duration: '4:31', audioUrl: 'https://example.com/slow.mp3' },
  ],
  '11': [ // Pop Classics
    { id: '1', title: 'Billie Jean', artist: 'Michael Jackson', duration: '4:54', audioUrl: 'https://example.com/billie.mp3' },
    { id: '2', title: 'Like a Prayer', artist: 'Madonna', duration: '5:39', audioUrl: 'https://example.com/prayer.mp3' },
    { id: '3', title: 'Sweet Dreams', artist: 'Eurythmics', duration: '3:36', audioUrl: 'https://example.com/dreams.mp3' },
    { id: '4', title: 'Take On Me', artist: 'a-ha', duration: '3:46', audioUrl: 'https://example.com/take.mp3' },
    { id: '5', title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper', duration: '3:58', audioUrl: 'https://example.com/girls.mp3' },
  ],
  '12': [ // Rock Legends
    { id: '1', title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: '8:02', audioUrl: 'https://example.com/stairway.mp3' },
    { id: '2', title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', audioUrl: 'https://example.com/bohemian.mp3' },
    { id: '3', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', duration: '5:56', audioUrl: 'https://example.com/sweet.mp3' },
    { id: '4', title: 'Back in Black', artist: 'AC/DC', duration: '4:15', audioUrl: 'https://example.com/black.mp3' },
    { id: '5', title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01', audioUrl: 'https://example.com/teen.mp3' },
  ],
};