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
    }
}

function updateRecord(studyhours, studyMinutes, studySeconds){
    const today = new Date().toLocaleDateString();
    const subject = document.getElementById("startContent").value;
    const record = document.createElement("p");
    record.textContent = `${today} : ${subject} / ${String(studyhours).padStart(2, '0')}:${String(studyMinutes).padStart(2, '0')}:${String(studySeconds).padStart(2, '0')}`;
    
    document.getElementById("history").appendChild(record);
}
