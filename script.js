function generateLinks() {
    // Get the container element where links will be added
    const container = document.getElementById("fileLinks");

    // Iterate through each file name in the JSON data
    fileNames.files.forEach(fileName => {
        // Create an anchor element for each file
        const list = document.createElement("li");
        const link = document.createElement('a');

        // Set the href attribute to the file name
        link.setAttribute("href", fileName.path);
        link.setAttribute("target", "_blank");
        link.setAttribute("thumbnail",fileName.thumbnailpath);
        link.textContent=fileName.name;
        // link.classList.add("test");

        // Create and set the thumbnail image
        // const thumbnail = document.createElement("img");
        // thumbnail.setAttribute("src", fileName.thumbnailpath);
        // link.appendChild(thumbnail);

        // Create and set the game name span
        // const gameName = document.createElement("span");
        // gameName.innerText = fileName.name;
        // link.appendChild(gameName);

        // Append the link to the container
        list.appendChild(link)
        container.appendChild(list);
        
    });

    // Set up navigation event listeners after links are created
    setupNavigation();
}

function setupNavigation() {
    const elements = document.querySelectorAll('a');
    console.log(elements);
    const gameimage = document.getElementById("gameimage");
    let currentIndex = 0;
    document.querySelector(".scrolling_list a").focus()
    if (elements.length > 0) {
        // Initial selection
        elements[currentIndex].classList.add('selected');
        gameimage.src=elements[currentIndex].getAttribute("thumbnail");
        function navigate(event) {
            // Remove current selection
            elements[currentIndex].classList.remove('selected');

            /* if (event.key === 'ArrowRight' || event.key==='d') {
                currentIndex = (currentIndex + 1) % elements.length;
            } else if ( event.key === 'ArrowLeft' || event.key==='a') {
                currentIndex = (currentIndex - 1 + elements.length) % elements.length;
            }else  */
            if (event.key==='ArrowDown' || event.key==='s'){
                if (currentIndex<elements.length-1){
                    currentIndex=(currentIndex+1);
                    elements[currentIndex].focus();
                    elements[currentIndex].scrollIntoView({behavior:'smooth',block:'center'});
                }
            }else if (event.key === 'ArrowUp' || event.key==='w'){
                if (currentIndex>0){
                    currentIndex=(currentIndex-1);
                    elements[currentIndex].focus();
                    elements[currentIndex].scrollIntoView({behavior:'smooth',block:'center'});
                }
            }
            
            else if (event.key === 'Enter') {
                // Trigger a click on the currently selected link
                elements[currentIndex].click();
                //return; // Exit the function to avoid adding 'selected' class again
            }

            // Add new selection
            elements[currentIndex].classList.add('selected');
            gameimage.src=elements[currentIndex].getAttribute("thumbnail");

            /* 
            if (elements[currentIndex].getBoundingClientRect().bottom > window.innerHeight ||elements[currentIndex].getBoundingClientRect().top < 0 && currentIndex > 4) {
                elements[currentIndex].scrollIntoView({behavior: "smooth"})
            } 
            if (currentIndex < 5) {
                window.scrollTo({top: 0, behavior: 'smooth'})
            }
             */
        }

        // Add event listener for keydown event
        window.addEventListener('keydown', navigate);
    }
}

window.onload = generateLinks;

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
