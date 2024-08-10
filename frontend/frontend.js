const API_URL = "http://localhost:3000/tasks";

const generatePage = (tasks) => {

  var complete = '<h2>Finished Tasks</h2><ul>';
  var incomplete = '<h2>Pending Tasks</h2><ul>';

  tasks.map((item) => {

    const { title, description, status, pdflink } = item; //destructuring

    const taskSummary = `Task: ${title}\nDescription: ${description}\nStatus: ${status}`;
    console.log(taskSummary);//I logged the task summary. I did not use task summary in the generated HTML because I want to style it differently.
    
    let deleteId = `onclick="deleteTask('${item._id}')"`;
    let updateStatus = `onclick="updateTaskStatus('${item._id}', '${status.toLowerCase() === 'finished' ? 'unfinished' : 'finished'}')"`;

    let tmp = `<li><div class="tasktext"><h3 class="title">${title}</h3><p class="desc">${description}</p></div><div class="taskbtn"><button class="pdflink"><a href="${pdflink}" target="_blank">PDF</a></button><button class="del" ${deleteId}>Delete</button>`;

    if (item.status.toLowerCase() === 'finished') {
      complete += tmp + `<button class="setnotdone" ${updateStatus}>Undo Done</button></div></li>`;
    } else if (item.status.toLowerCase() === 'unfinished') {
      incomplete += tmp + `<button class="setdone" ${updateStatus}>Set Done</button></div></li>`;
    }
  });

  complete += '</ul>';
  incomplete += '</ul>';
  document.getElementById("unfinished").innerHTML = incomplete;
  document.getElementById("finished").innerHTML = complete;
};

const fetchData = async () => {

  try {

    const response = await fetch(`${API_URL}`)
    let tasks = await response.json();

    generatePage(tasks);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const postTask = async (t, d, s, p) => {

  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      body: JSON.stringify({
        title: t,
        description: d,
        status: s,
        pdflink: p
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    fetchData();

  } catch (error) {
    console.error("Error posting task:", error);
  }
};

const addTask = () => {
  try {
    let t = prompt("Enter Task Title:", "Demo Task");
    let d = prompt("Enter Task Description:", "This is a task description");
    let s = prompt("Enter 'finished' or 'unfinished':", "unfinished");
    let p = prompt("Enter PDF Link:", "blablabla.pdf");
    console.log(t, d, s, p);
    postTask(t, d, s, p);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    fetchData();

  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        status: newStatus
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    fetchData();

  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

const fileSubmit = async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/tasks/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    fetchData();
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

fetchData();