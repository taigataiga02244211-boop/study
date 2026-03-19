let time = 0;
let totaltime = 0;
let timer;
let running = false;

function toggleTimer() {
    let button = document.getElementById("startButton");

    if (!running) {
        running = true;

        button.textContent = "STOP";
        button.classList.remove("btn-primary");
        button.classList.add("btn-danger");

        timer = setInterval(() => {
            time++;
            
            let hours = Math.floor(time / 3600);
            let minutes = Math.floor((time % 3600) / 60);
            let seconds = time % 60;

            document.getElementById("timer").textContent =
                String(hours).padStart(2, '0') + ":" +
                String(minutes).padStart(2, '0') + ":" +
                String(seconds).padStart(2, '0');

        }, 1000);

    } else {
        running = false;
        totaltime += time;
        clearInterval(timer);
        
        let totalhours = Math.floor(totaltime / 3600);
        let totalMinutes = Math.floor((totaltime % 3600) / 60);
        let totalSeconds = totaltime % 60;

        let studyhours = Math.floor(time / 3600);
        let studyMinutes = Math.floor((time % 3600) / 60);
        let studySeconds = time % 60;

        button.textContent = "START";
        button.classList.remove("btn-danger");
        button.classList.add("btn-primary");

        document.getElementById("result").textContent =
            "今回の勉強時間：" +
            String(studyhours).padStart(2, '0') + ":" + 
            String(studyMinutes).padStart(2, '0') + ":" +
            String(studySeconds).padStart(2, '0');

        document.getElementById("total").textContent =
        "合計時間：" +
        String(totalhours).padStart(2, '0') + ":" +
        String(totalMinutes).padStart(2, '0') + ":" +
        String(totalSeconds).padStart(2, '0');
        time = 0;
        document.getElementById("timer").textContent = "00:00:00";

        updateRecord(studyhours, studyMinutes, studySeconds);
        sendStudyData();
    }
}

function updateRecord(studyhours, studyMinutes, studySeconds){
    const today = new Date().toLocaleDateString();
    const subject = document.getElementById("startContent").value;
    const record = document.createElement("p");
    record.textContent = `${today} : ${subject} / ${String(studyhours).padStart(2, '0')}:${String(studyMinutes).padStart(2, '0')}:${String(studySeconds).padStart(2, '0')}`;
    
    document.getElementById("history").appendChild(record);
}

//保存
function saveName(){
    const name = document.getElementById("username").value;
    localStorage.setItem("username", name);
}

//取り出す
const username = localStorage.getItem("username");
document.getElementById("username").value = localStorage.getItem("username");

//exec 書き込み専用 CSV 読み込み専用
//書き込み
function sendStudyData(){
    const username = localStorage.getItem("username");
    const subject = document.getElementById("startContent").value;
    const sendTime = totaltime;

    fetch("https://script.google.com/macros/s/AKfycbwLkvn-UJao1oTJY8nleqPTqbPk0KFXva7GaYQ6nZ3rcRyuljj-5iaHSX1CIWU0r3iT/exec", {
        method: "POST",
        body: JSON.stringify({
            name: username,
            subject: subject,
            time: sendTime
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data)
        loadRanking();
    })
    .catch(error => console.log(error));
}

//読み込み
function loadRanking(){
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQwQtcZ2JlqvdupX6iiZGwAsx0BTusii3nIzZA6hx4u_VwsBZlVfrmzmJz1TOTlHzH9IM6H0byYqVIx/pub?output=csv")
  .then(response => response.text())
  .then(data => {
      const lines = data.split("\n");
      const totals = {};

      lines.forEach(line => {
          const cols = line.split(",");
          const name = cols[0];
          const time = Number(cols[2].trim());
          
          if(!name || isNaN(time)) return;

          if(totals[name]){
              totals[name] += time;
          } else {
              totals[name] = time;
          }
      });

      const ranking = Object.entries(totals)
          .sort((a,b)=> b[1]-a[1]);

      let text = "";

      ranking.forEach((item,index)=>{
        const minutes = Math.floor(item[1] / 60);
        const seconds = item[1] % 60;
        text += `${index+1}位 ${item[0]} ${minutes}分 ${String(seconds).padStart(2, '0')}秒<br>`;
      });

      document.getElementById("ranking").innerHTML = text;
  });
}