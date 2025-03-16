document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("posts-container")) {
        cargarApuntes();
    }
    if (document.getElementById("add-form")) {
        document.getElementById("add-form").addEventListener("submit", agregarApunte);
    }
    if (document.getElementById("post-title")) {
        mostrarApunte();
    }
});

function cargarApuntes() {
    fetch("post.json")
        .then(response => response.json())
        .then(apuntes => {
            const contenedor = document.getElementById("posts-container");
            contenedor.innerHTML = "";
            apuntes.forEach(apunte => {
                const div = document.createElement("div");
                div.classList.add("post");
                div.innerHTML = `<h2>${apunte.title}</h2>
                                 <a href="post.html?id=${apunte.id}">Ver más</a>`;
                contenedor.appendChild(div);
            });
        });
}

function agregarApunte(event) {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const categories = document.getElementById("categories").value.split(",").map(c => c.trim());
    const tags = document.getElementById("tags").value.split(",").map(t => t.trim());
    
    fetch("post.json")
        .then(response => response.json())
        .then(apuntes => {
            const nuevoApunte = {
                id: apuntes.length + 1,
                title,
                content,
                categories,
                tags
            };
            apuntes.push(nuevoApunte);
            return apuntes;
        })
        .then(nuevosApuntes => {
            return fetch("post.json", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevosApuntes, null, 4)
            });
        })
        .then(() => {
            window.location.href = "index.html";
        });
}

function mostrarApunte() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);
    
    fetch("post.json")
        .then(response => response.json())
        .then(apuntes => {
            const apunte = apuntes.find(a => a.id === id);
            if (apunte) {
                document.getElementById("post-title").innerText = apunte.title;
                document.getElementById("post-content").innerHTML = marked.parse(apunte.content);
                document.getElementById("post-categories").innerText = apunte.categories.join(", ");
                document.getElementById("post-tags").innerText = apunte.tags.join(", ");
            }
        });
}