
var light = document.querySelector('.hero img');
const div = document.querySelector(".inputs");
const box = document.querySelector('.add');

// toggle light and dark theme
light.addEventListener("click", ()=>{
    if (light.src.includes('icon-sun.svg')) {
        light.src = './images/icon-moon.svg';
        div.classList.add('bg-white');
        box.classList.add('bg-white');
    } else {
        light.src = './images/icon-sun.svg';
        div.classList.remove('bg-white');
        box.classList.remove('bg-white');
    }
});

const tasks = document.querySelector('.tasks');
const input = document.querySelector('.enter');
const count = document.querySelector('.count');

let taskLists = [];
let counter = 0;

// save tasks in the local storage
function saveTasks() {
    localStorage.setItem('taskLists', JSON.stringify(taskLists.map(task => {
        return {
            text: task.querySelector('.task-text').textContent,
            complete: task.classList.contains('complete')
        };
    })));
}

// load data from local storage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('taskLists'));
    if (savedTasks) {
        savedTasks.forEach(taskData => {
            createTaskElement(taskData.text, taskData.complete);
        });
    }
}
// function to add a new task element
function createTaskElement(txt, isComplete = false) {
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    
    newTask.innerHTML = `
    <div class= "item">
      <label class="custom-checkbox">
        <input type="checkbox" class="task-checkbox" ${isComplete ? 'checked' : ''}>
        <span class="checkbox-indicator"></span>
      </label>
      <p class="task-text">${txt}</p>
      </div>
      <div class="close">
      <img src="./images/icon-cross.svg" alt="">
      </div>
    `;
    
    if (isComplete) {
        newTask.querySelector('.task-text').style.textDecoration = 'line-through';
        newTask.querySelector('.task-text').style.color = 'silver';
        newTask.classList.add('complete');
    }

    newTask.addEventListener('mouseenter', function() {
        const closeIcon = newTask.querySelector('.close');
        closeIcon.classList.add('view');
    });
    
    newTask.addEventListener('mouseleave', function() {
        const closeIcon = newTask.querySelector('.close');
        closeIcon.classList.remove('view');
    });

    newTask.querySelector('.close').addEventListener('click', function() {
        newTask.remove();
        taskLists = taskLists.filter(task => task !== newTask);
        counter--;
        count.textContent = counter;
        saveTasks();
    });

    tasks.appendChild(newTask);
    taskLists.push(newTask);

    const checkbox = newTask.querySelector('.task-checkbox');
    const taskText = newTask.querySelector('.task-text');
    
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            taskText.style.textDecoration = 'line-through';
            newTask.classList.add('complete');
            taskText.style.color = 'silver';          
        } else {
            taskText.style.textDecoration = 'none';
            taskText.style.color = 'white';  
        }
        saveTasks();
    });

    counter++;
    count.textContent = counter;
    saveTasks();
}

function createTask() {
    input.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {
            const txt = input.value;
            createTaskElement(txt);
            input.value = ''; 
        }
    });

    const completed = document.querySelector('.task-completed');
    const all = document.querySelector('.active');
    const active = document.querySelector('.uncomplete');
    const clearCompleted = document.querySelector('.clear');

    // show the completed task list
    completed.addEventListener('click', () =>{
        tasks.innerHTML = '';
        taskLists.forEach(task => {
            if (task.classList.contains('complete')) {
                tasks.appendChild(task);
            }
        });
    });

    // show the uncompleted task list
    active.addEventListener('click', ()=>{
        tasks.innerHTML = '';
        taskLists.forEach(task => {
            if (!task.classList.contains('complete')) {
                tasks.appendChild(task);
            }
        });
    });

        // show all the tasks
    all.addEventListener('click', () => {
        tasks.innerHTML = '';
        taskLists.forEach(task => {
            tasks.appendChild(task);
        });
    });

    // clear the list of tasks completed
    clearCompleted.addEventListener('click', () => {
        taskLists = taskLists.filter(task => {
            if (task.classList.contains('complete')) {
                task.remove();
                return false;
            }
            return true;
        });
        counter = taskLists.length;
        count.textContent = counter;
        saveTasks();
    });
}

loadTasks();
createTask();
