fetch("data/courses.json")
    .then(response => response.json())
    .then(data => {
        const coursesContainer = document.getElementById("courses-container");
        const courses = data.courses;

        courses.forEach(course => {
            const courseCard = document.createElement("article");
            courseCard.classList.add("course-card");
            courseCard.innerHTML = `
                <h3>${course.code} - ${course.title}</h3>
                <dl>
                    <dt>Faculty:</dt>
                    <dd>${course.faculty}</dd>
                    <dt>Credits:</dt>
                    <dd>${course.credits}</dd>
                    <dt>Schedule:</dt>
                    <dd>${course.schedule}</dd>
                    <dt>Room:</dt>
                    <dd>${course.room}</dd>
                </dl>
                <div class="course-links">
                    <a href="#" class="btn btn-sm">Syllabus</a>
                    <a href="#" class="btn btn-sm">Resources</a>
                </div>
            `;
            coursesContainer.appendChild(courseCard);
        });
    })
    .catch(err => {
        const coursesContainer = document.getElementById("courses-container");
        if (coursesContainer) {
            coursesContainer.innerHTML = '<p class="error">Failed to load courses. Please try again later.</p>';
        }
        console.error('Error loading courses:', err);
    });