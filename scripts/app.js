
const mode = document.querySelector('#dark-light-mode');
const task = document.querySelector('#inputTask');
const input = document.querySelector('#input');
const btnCheck = document.querySelector('#button');
const ul = document.querySelector('ul');
const all = document.querySelector('#all');
const active = document.querySelector('#active');
const completed = document.querySelector('#completed');
const btnClearComplete = document.querySelector('#clearCompleted');
const itemsLeft = document.querySelector('.itemsLeft');
let acc = 0;

// EVENTS

window.addEventListener('DOMContentLoaded', () => {
    mode.addEventListener('click', modeFunction);
    task.addEventListener('submit', newtask);

})

// FUNCTIONS

function modeFunction(e){
    e.preventDefault();
    const main = document.querySelector('#main');
    const background = document.querySelector('#background');
    const tastkInfo = document.querySelector('.taskInfo');

    if(mode.classList.contains('toggle')){
        mode.classList.toggle('icon-light')
        mode.removeAttribute('src', './images/icon-sun.svg');
        main.classList.toggle('light');
        background.classList.toggle('bg-light');
        task.classList.toggle('newTask-light');
        ul.classList.toggle('ul-light');
        tastkInfo.classList.toggle('task-info-light');
        document.querySelector('.activity').classList.toggle('activity-light')
    } 
}

function newtask(e) {
    e.preventDefault();
    const task = input.value;
    if(!task) {
        const showMessage = new UI();
        showMessage.showAlert('You must create a new task', 'alert');
    } else {
        const newTodo = new Task(task);
    }

    input.value = '';
}

// CREATING NEW TASK IN THE DOM

class Task {
    constructor(newTask) {
        this.createLi(newTask);
    }

    createLi(task) {
        const li = document.createElement('li');
        li.setAttribute('draggable', 'true');
        li.classList.add('task')
        const button = document.createElement('button');
        const span = document.createElement('span');
        const check = document.createElement('img');
        

        const input = document.createElement('input');
        input.type = 'text';
        input.setAttribute("disabled", "");
        input.value = task;
        
        const img = document.createElement('img');
        img.setAttribute('src', './images/icon-cross.svg');
        img.setAttribute('alt', 'delete symbol');
        img.classList.add('delete');
        
        span.appendChild(check)
        button.appendChild(span);
        li.appendChild(button);
        li.appendChild(input);
        li.appendChild(img);

        ul.insertBefore(li,document.querySelector('.taskInfo'));

        // DO NOT SHOW NEW TASK WHEN COMPLETE ARE CHECKED
        if(completed.checked){
            li.classList.add('display-none');
        }
        
        // Accumulator for items lefts
        let acc1 = acc += 1;

        this.itemsAdd(acc1);

        // Filter Array
        this.filter();

        // Checkbox click
        button.onclick = () => {
            if(button.id == 'checked'){
                span.classList.remove('button-bg');
                li.classList.remove('checked')
                check.removeAttribute('src' , './images/icon-check.svg');
                button.removeAttribute('id', 'unchecked');
                input.style.textDecoration = 'none';
                input.style.opacity = 'unset';

                acc1 = acc += 1;
                this.itemsAdd(acc1);
                this.filter();
            } else {
                button.setAttribute('id', 'checked');
                span.classList.add('button-bg');
                li.classList.add('checked')
                check.setAttribute('src', './images/icon-check.svg');
                input.style.textDecoration = 'line-through 2px';
                input.style.opacity = '0.3';

                acc1 = acc -= 1;
                this.itemsAdd(acc1);
                this.filter();
            }
        }

        // Delete task
        img.onclick = () => {
            input.parentNode.remove();

            if(!button.id === 'checked'){
                acc1 = acc -= 1;
                this.itemsAdd(acc1)
            } else if(button.id === 'checked'){
                acc1 = acc;
                this.itemsAdd(acc1);
            } else {
                acc1 = acc -= 1;
                this.itemsAdd(acc1);

            }
            this.filter()
        }

        // CLEAR COMPLETED
        btnClearComplete.onclick = () => {
            
            document.querySelectorAll('li').forEach(todo => {
                if(todo.classList.contains('checked')){
                    todo.remove();
                    //empty.showAlert('No completed tasks', 'success');
                }
            })
            this.filter();
        } 
    }
    
    // ITEMS_LEFT
    itemsAdd(items) {
        itemsLeft.textContent = `${items} items left`;
        document.querySelector('.taskInfo').insertBefore(itemsLeft, document.querySelector('.activity'));
    }

    filter() {
        const arr = []
        const listsContainer = document.querySelectorAll('#ul li.task');
        [...listsContainer].forEach(item => {
            arr.push({
                task: item,
                completed: item.classList.contains('checked')
            })
        })
        console.log(arr);
        this.filterTask(arr);
        localStorage.setItem('todos', JSON.stringify(arr));
    }

    filterTask(arr){
        
        completed.onclick = () => {
            arr.forEach(item => {
                if(!item.completed ){
                    item.task.classList.add('display-none');
                }else {
                    item.task.classList.remove('display-none')
                }
            })
        }
        
        all.onclick = () => {
            arr.forEach(item => {
                if(item.completed || !item.completed){
                    item.task.classList.remove('display-none');
                }
            })
        }

        active.onclick = () => {
            arr.forEach(item => {
                if(item.completed){
                    item.task.classList.add('display-none');
                } else {
                    item.task.classList.remove('display-none');
                }
            })
        }
    }
} 

class UI {
    showAlert(message, tipe){
        const showMessage = document.createElement('p');
        if(tipe === 'alert'){
            showMessage.classList.add('alertMessage');
            showMessage.textContent = message;

            document.querySelector('#divAlert').appendChild(showMessage);
            
            setTimeout(() => {
                showMessage.remove();
            }, 2000);
        } 
    }
}



