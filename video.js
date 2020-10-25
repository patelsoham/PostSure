var net = getNet();

const popupEle = document.getElementById('video-mod');
const signUp = document.querySelector('.sign-up');
const statsDiv = document.getElementById('stats-div');
const statsBtn = document.getElementById('stats-btn');
const minimize = document.getElementById('min');
const graphs = document.getElementById('graphs');
async function main(net) {
  signUp.classList.add('hidden');
  popupEle.classList.remove('hidden');
  minimize.classList.remove('hidden');
  statsDiv.classList.remove('hidden');
  net = await net;
  let vidElement = await getVideo();
  detectPose(vidElement, net);
  console.log(`Before: ${percentages}`);
  setInterval(() => {
    if((globalPostures[1] + globalPostures[0]) !== 0) {
      pushStats(percentages, 100*(globalPostures[0]/(globalPostures[1] + globalPostures[0])));
    }}, 30000);
}

let currCtx = document.getElementById('currChart').getContext('2d');
let lifeCtx = document.getElementById('lifeChart').getContext('2d');

async function getCharts() {
  let userDoc = await db.collection('users').doc(`${email}`).get();
  let docData = await userDoc.data();
  let currChart = getChart(currCtx, docData.lastSession, "Most Recent", 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
  let lifeTimeChart = getChart(lifeCtx, docData.lifetime, "Lifetime", 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
}

statsBtn.addEventListener('click', function() {
  popupEle.classList.toggle('hidden');
  minimize.classList.toggle('hidden');
  graphs.classList.toggle('hidden');
  statsBtn.innerText = statsBtn.innerText === "Statistics" ? "Return": "Statistics";
  getCharts();
});

function getChart(ctx, arr, name, backgroundColor, borderColor) {
  return new Chart(ctx, {
    type: 'line',
    data: {
        labels: new Array(arr.length).fill(''),
        datasets: [{
            data: arr,
            backgroundColor: [
                backgroundColor,
            ],
            borderColor: [
              borderColor,
            ],
            borderWidth: 2
        }]
    },
    options: {
        legend: {
          display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    stepSize: 20
                },
                scaleLabel: {
                  display: true,
                  labelString: 'PostSure Percentage (%)',
                  fontStyle: 'bold'
                }, 
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }], 
            xAxes:[{
                scaleLabel: {
                    display: true, 
                    labelString: '',
                    fontStyle: 'bold'
                }, 
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }]
        },
        title: {
          display: true,
          text: name,
          fontSize: 12
        },
    }
  }); 
}
//main(net);
