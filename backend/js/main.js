const output  = document.querySelector('#output');
const button  = document.querySelector('#get-posts-btn');


async function showPosts(){

    try {

        const res = await fetch('http://localhost:5176/api/posts');

        if (!res.ok){
            throw new Error ('Failed to fetch posts');
        }

        const posts = await res.json();
        output.innerHTML = '';

        posts.forEach(e => {
            const postEl = document.createElement('div');
            postEl.textContent = e.title;
            output.appendChild(postEl)
        });

    } catch (error) {
        console.log("Error happened");
    }
}

button.addEventListener('click', showPosts);