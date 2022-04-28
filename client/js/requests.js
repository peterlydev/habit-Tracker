const auth = require('./auth');

const addHabits = document.querySelector('.add-habit'); //Selecting the form
const habitsList = document.querySelector('.habits')//Selecting the habit list
// const habits = JSON.parse(localStorage.getItem('habits')) || []; //where we will add the habit list to
const habitSubmit = document.querySelector('#submit');
// const countBtn = document.querySelectorAll('.count');
// const countBtn1 = document.querySelector('#count1');
const loadCheck = document.querySelector('.dashboard-page');
const userMsg = document.querySelector('#user-msg');

// const logOut = document.querySelector('log-out');

//Line 3 = Method on JSON that allows us to convert a string to JSON object that allows us to make habits an array of objects

//add habit
// function addHabit(e) {
//     e.preventDefault(); //Stops page from refreshing
//     //Adding Habit, counts and frequency to the function
//     const text = this.querySelector("[name=habit]").value;
//     const totalCounts = +this.querySelector("[name=reps]").value;
//     const timeframe = this.querySelector("[name=timeframe").value;
// //Storing habit into an object
//     const habit = {
//         text: text,
//         reps: 0,
//         totalCounts: totalCounts,
//         timeframe: timeframe,
//         completed: false //by default in case habit is never completed
//     }

//     habits.push(habit)//add content to the array
//     listHabits(habits, habitsList); //Pushes the information to the array
//     localStorage.setItem('habits', JSON.stringify(habits))
//     this.reset(); //resets all fields on the form

//     console.log(habit) //Logs to the console for testing
// }


//List the habit
async function listsHabits(){
    try {
        const authHabits = await auth.userHabits();
        if(!authHabits) return;
        authHabits.map((obj) => {
            const list = habitItem(obj);
            habitsList.append(list);
        })
    } catch (error) {
        console.warn(error)
    }
}

async function createHabit(e){
    try {
        e.preventDefault();
        const create = await auth.postHabit(e);
        console.log(create);
        const list = habitItem(create);
        habitsList.append(list)
    } catch (error) {
        console.warn(error)
    }
}

function habitItem(obj){
    const list = document.createElement('li');

    const input = document.createElement('input');
    input.setAttribute('type','checkbox');
    input.setAttribute('id', `habit${obj.habit_id}`);
    list.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute('for', `habit${obj.habit_id}`);

    const completeBtn = document.createElement('button');
    if (label.textContent.includes("COMPLETED!")){
        return;
    } else if (obj.curr_repetitions === obj.repetitions){
        label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}  |   COMPLETED!`;
    }
    else {
        label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}` 
    };
    list.appendChild(label);

    const div = document.createElement('div');
    div.setAttribute('class','habit-btns');

    const countBtn = document.createElement('button');
    countBtn.setAttribute('class','count');
    countBtn.setAttribute('id',`count${obj.habit_id}`);
    countBtn.textContent = "+";
    // countBtn.addEventListener('click', addReps(obj, label));
    countBtn.addEventListener('click', async function(){
        console.log(obj.habit_id)
        await auth.patchReps(obj.habit_id);
        label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}`;
        location.reload();
    });
    // countBtn.addEventListener('click', window.location.reload());
    div.appendChild(countBtn);

    // const completeBtn = document.createElement('button');
    completeBtn.setAttribute('class','complete');
    completeBtn.setAttribute('id',`complete${obj.habit_id}`);
    completeBtn.textContent = "Mark as Complete";
    completeBtn.addEventListener('click', function(){
        input.checked ? input.checked = false : input.checked = true;
    })
    div.appendChild(completeBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class','delete');
    deleteBtn.setAttribute('id',`delete${obj.habit_id}`);
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener('click', async () => {
		await auth.deleteHabit(obj.habit_id);
		location.reload();
	});
    div.appendChild(deleteBtn);

    list.appendChild(div); 
    return list;   
}

// function addReps (obj, label){
//     auth.patchReps(obj.habit_id);
//     return label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}`;
    
// }
// Function to add Habits to the HTML
// function listHabits(habits = [], habitsList) {
//     habitsList.innerHTML = habits.map((habit, i) => {
//         //What to add onto the HTML
//         return `
//         <li>
//         <input type="checkbox" data-index=${i} id="habit${i}" ${habit.completed ? "checked" : ""
//     } />
//         <label for="habit${i}">${habit.reps}/${habit.totalCounts} ${
//     habit.text}<br>
//     ${habit.timeframe}</label>
//             <div class="habit-btns">
//       <button class="count" data-index=${i}
//       id="count${i}">+</button>
//       <button class="complete" data-index=${i} id="complete${i}">Mark as Complete</button>
//       <button class="delete" data-index=${i} id="delete${i}">Delete</button>
//       </div>
//         </li>
//         `;
//     })
// }

//Toggle if complete

// function countComplete(e){ //Clicking on the checkbox
//     if (!e.target.matches('input')) return;
//     const el = e.target;
//     const index = el.dataset.index;

//     if (habits[index].reps === habits[index].totalCounts) {
//         habits[index].completed = true;
//     } else if (habits[index].reps > habits[index].totalCounts) {
//         habits[index].reps = 0;
//         habits[index].completed = false;
//     }

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
//     // console.log(e.target)
// }
// Count function

// function count(e){ //Clicking on the checkbox
//     if (!e.target.matches('.count')) return;
//     const el = e.target;
//     const index = el.dataset.index;
//     habits[index].reps += 1;

//     if (habits[index].reps === habits[index].totalCounts) {
//         habits[index].completed = true;
//         habits[index].reps += 0;
//     } else if (habits[index].reps > habits[index].totalCounts) {
//         habits[index].reps = 0;
//         habits[index].completed = false;
//     }

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
//     // console.log(e.target)
// }


//Delete Habit
// function deleteHabit(e) {
//     if (!e.target.matches('.delete')) return;
//     const el = e.target;
//     const index = el.dataset.index;

//     habits.splice(index, 1);

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
    

// }

//Mark as Complete
// function markComplete(e){
//     if (!e.target.matches('.complete')) return;
//     const el = e.target;
//     const index = el.dataset.index;

//     habits[index].completed = true;

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
    
// }


//Listen out for a submit, for the function to run
if(loadCheck){
    userMsg.textContent = `${auth.currUser}, choose a goal to achieve..`
    window.addEventListener('DOMContentLoaded', listsHabits);
// addHabits.addEventListener('submit', addHabit);
// habitsList.addEventListener('click', countComplete);
// habitsList.addEventListener('click', deleteHabit);
// habitsList.addEventListener('click', markComplete);
// habitsList.addEventListener('click', count);
// habitSubmit.addEventListener('submit', createHabit);
    addHabits.addEventListener('submit', createHabit);
// countBtn1.addEventListener('click', ()=>{
//     console.log('click');
// })
// window.addEventListener('load', () => {
//     Array.from(countBtn).forEach(b => {
//         b.addEventListener('click', function() {
//          console.log("clicked");});
//     })
// })
// countBtn.addEventListener("click", addReps);

// listHabits(habits, habitsList)
};

// logOut.addEventListener('click', () => {
//     window.location.pathname = ('client/login.html')
// })


module.exports = { createHabit, listsHabits, habitItem }

