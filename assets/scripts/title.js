title = document.getElementById('title');
titles = ['an artist', 'a designer', 'a programmer', 'a videomaker', 'an educator', 'a media artist', 'an XR geek', 'a digital crafter', 'a cyberpunker', 'a permacomputer', 'a critical thinker', 'a creative technologist']
emoji = ['🛹', '🌱 ', '💻', '🪰', '🍌', '📍', '🌞', '🐢', '🤌']

setInterval(() => {
    title.innerHTML = `${emoji[Math.floor(Math.random() * emoji.length)]} Leo Scarin is ${titles[Math.floor(Math.random() * titles.length)]}`
}, 100);