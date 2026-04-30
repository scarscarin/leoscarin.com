const title = document.getElementById('title');
const titles = ['an artist', 'a designer', 'a programmer', 'an educator', 'a media artist', 'doing his best', 'an interaction designer', 'a handsome young man', 'a geek', 'a code crafter', 'a nerd', 'a coder', 'a permacomputer', 'a critical thinker', 'a creative technologist', 'in love', 'sometimes tired', 'a good friend']
const emoji = ['🛹', '🌱 ', '💻', '🪰', '🍌', '📍', '🌞', '🐢', '🤌']

setInterval(() => {
    title.innerHTML = `${emoji[Math.floor(Math.random() * emoji.length)]} Leo Scarin is ${titles[Math.floor(Math.random() * titles.length)]}`
}, 1000);