const slider = document.getElementById("slider");

var project = "1207977707410718";
var datas = [];
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    authorization:
      "Bearer 2/1206837539138379/1208044437347972:3051e11c0e684d47256e9ccbab7e0429",
  },
};
var secaos = [];
var moveScroll = 0;
const cores = ["secao-1", "secao-2", "secao-3", "secao-4"];
var myChart;
var rodou = [];
tasks = [];
var myChart2;
let menorData = new Date();
let maiorData = new Date();
var responsavel = [];
var datas_task;
var selectedValue = "week";
var emExecucao = [];
document.getElementById("input-month").value = new Date()
  .toISOString()
  .slice(0, 7);
button = document.querySelector("#today");

button.addEventListener("click", () => {
  document.getElementsByClassName("colLarge")[0].scrollLeft = moveScroll - 300;
  slider.value = moveScroll - 300;
});

function mudarLayout() {
  var select = document.getElementById("layoutSelect");

  if (select.value === "quadro") {
    document.querySelector(".scrollable-section").style.display = "flex";
    document.querySelector(".container_chart").style.display = "none";
    document.querySelector(".slider-container").style.display = "none";
  } else if (select.value === "gantt") {
    document.querySelector(".scrollable-section").style.display = "none";
    document.querySelector(".slider-container").style.display = "block";
    document.querySelector(".container_chart").style.display = "block";
  }
}

function switchData(section) {
  datas = [];
  var teste = false;
  if (!rodou.includes(section)) {
    rodou.push(section);
    teste = true;
  } else {
    let index = rodou.indexOf(section);
    rodou.splice(index, 1);
    teste = false;
  }
  secaos.forEach((item, index) => {
    datas.push({
      x: [`${item.start}`, `${item.end}`],
      y: item.name,
      name: "",
      status: "",
      completed: false,
      statusColor: "red",
      prioridadeColor: cores[index % cores.length],
    });

    datas_task.forEach((task) => {
      rodou.forEach((sections) => {
        if (task.name == sections && item.name == sections) {
          let texto = " - " + task.y;

          if (texto.length > 50) {
            texto = texto.slice(0, 47) + "...";
          }

          datas.push({
            x: task.x,
            y: texto,
            name: task.name,
            status: task.status,
            completed: task.completed,
            statusColor: task.statusColor,
            prioridadeColor: task.prioridadeColor,
          });
        }
      });
    });
  });
  if (teste) {
    myChart.destroy();
    myChart2.destroy();
    loadCharge();
    loadCharge2();
    // myChart2.config._config.options.scales.y.afterFit = (ctx) => {
    //   ctx.width = 500;
    // };
    document.querySelector(".colSmall").style.width = "600px";
    myChart.update();
    myChart2.update();
  } else {
    myChart.destroy();
    myChart2.destroy();
    loadCharge();
    loadCharge2();
    // myChart2.config._config.options.scales.y.afterFit = (ctx) => {
    //   ctx.width = 500;
    // };
    document.querySelector(".colSmall").style.width = "600px";
    myChart.update();
    myChart2.update();
  }
}

function getSelectedOption() {
  const select = document.getElementById("time");
  selectedValue = select.value;
  selectedText = select.options[select.selectedIndex].text;
  // if (selectedValue == "quarter") {
  //   document.querySelector(".box").style.width = "calc(100vw - 300px)";
  // }
  //   myChart.options.scales.x.time.unit = selectedText;
  //   myChart2.options.scales.x.time.unit = selectedText;
  setTimeout(() => {
    if (myChart) {
      myChart.destroy();
      loadCharge();
    }
    if (myChart2) {
      myChart2.destroy();
      loadCharge2();
    }
  }, 1000);
}

function getMonthRange(event) {
  inputMonth = event.target.value;
  const [year, month] = inputMonth.split("-");
  const lastDay = (y, m) => {
    return new Date(y, m, 0).getDate();
  };

  myChart.config.options.scales.x.min = `${year}-${month}-01`;
  myChart.config.options.scales.x.max = `${year}-${month}-${lastDay(
    year,
    month
  )}`;
  myChart.update();
  myChart2.update();
}
const container = document.querySelector(".container_responsavel");
function getData() {
  fetch(
    "https://app.asana.com/api/1.0/projects/1207977707410718/tasks?opt_fields=completed,due_on,name,num_subtasks,start_on,memberships.section.name,memberships.project.name,custom_fields",
    options
  ) //custom_fields.display_value
    .then((response) => response.json())
    .then((response) => {
      container.innerHTML = "";
      datas = [];
      secaos = [];
      responsavel = [];
      response.data[0].custom_fields.forEach((custom) => {
        if (custom.gid == "1207977716334849") {
          custom.enum_options.forEach((item) => {
            responsavel.push(item.name);
            const div = document.createElement("div");
            const span = document.createElement("span");
            const p = document.createElement("p");

            span.textContent = item.name;
            div.appendChild(span);
            div.appendChild(p);

            container.appendChild(div);
          });
        }
      });
      response.data.forEach((item) => {
        var dono = "";
        var status = "";
        var secao = "";
        var color = "";
        var colorPrioridade = "";
        item.custom_fields.forEach((fields) => {
          if (fields.gid == "1207977716334849") {
            dono = fields.display_value;
          } else if (fields.gid == "1206778068794456") {
            status = fields.display_value;
            color = fields.enum_value.color;
          } else if (fields.gid == "1207991980621553") {
            if (fields.enum_value) {
              colorPrioridade = fields.enum_value.color;
            } else {
              colorPrioridade = "rgb(0,0,0)";
            }
          }
        });
        item.memberships.forEach((member) => {
          if (member.project.name == "Projetos Engenharia JFA") {
            secao = member.section.name;
          }
        });
        if (dono && status == "Em execução") {
          const index = responsavel.findIndex((s) => s === dono);
          if (index !== -1) {
            const container_div = document.querySelector(
              `.container_responsavel div:nth-child(${index + 1}) p`
            );
            if (container_div) {
              var styleElement = document.createElement("style");
              document.head.appendChild(styleElement);

              styleElement.sheet.insertRule(
                `
              .container_responsavel div:nth-child(${index + 1}) p::before {
                content: ".";
                position: absolute;
                left: 0px;
                display: flex;
                top: 7px;
                bottom: 0;
                width: 10px;
                height: 10px;
                color: transparent;
                z-index: 999;
                background-color: red;
                border-radius: 100%;
              }
            `,
                styleElement.sheet.cssRules.length
              );
              container_div.innerHTML = "";
              container_div.append(`‎ ‎ ${item.name}`);
            }
          }
        }

        if (item.start_on && item.due_on) {
          datas.push({
            x: [`${item.start_on}`, `${item.due_on}`],
            y: item.name,
            name: secao,
            status: status,
            completed: item.completed,
            statusColor: color,
            prioridadeColor: colorPrioridade,
          });
        }
      });
      datas_task = datas;
      response.data.forEach((item) => {
        item.memberships.forEach((member) => {
          if (member.project.name === "Projetos Engenharia JFA") {
            const secao = member.section.name;

            // Procura a seção existente no array `secaos`
            let secaoObj = secaos.find((s) => s.name === secao);

            // Converte as datas para objetos Date para comparação
            var startOnDate = new Date(item.start_on);
            if (item.start_on) {
              startOnDate = new Date(item.start_on);
            } else {
              startOnDate = new Date();
            }
            var dueOnDate = new Date();
            if (item.due_on) {
              dueOnDate = new Date(item.due_on);
            } else {
              dueOnDate = new Date();
            }

            if (!secaoObj) {
              secaos.push({
                name: secao,
                start: startOnDate,
                end: dueOnDate,
              });
            } else {
              if (startOnDate < secaoObj.start) {
                secaoObj.start = startOnDate;
              }
              if (dueOnDate > secaoObj.end) {
                secaoObj.end = dueOnDate;
              }
            }
          }
        });
      });

      secaos = secaos.map((secao) => ({
        ...secao,
        start: `${secao.start.getFullYear()}-${(secao.start.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${secao.start
          .getDate()
          .toString()
          .padStart(2, "0")}`,
        end: `${secao.end.getFullYear()}-${(secao.end.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${secao.end
          .getDate()
          .toString()
          .padStart(2, "0")}`,
      }));
      datas = [];
      secaos.forEach((item, index) => {
        datas.push({
          x: [`${item.start}`, `${item.end}`],
          y: item.name,
          name: "",
          status: "",
          completed: false,
          statusColor: "red",
          prioridadeColor: cores[index % cores.length],
        });
      });

      loadCharge();
      loadCharge2();
      console.log(response.data);
      tasks = secaos.map((secao) => ({ ...secao, task: [], media: 0 }));
      response.data.forEach((item) => {
        item.memberships.forEach((member) => {
          if (member.project.name === "Projetos Engenharia JFA") {
            const taskIndex = tasks.findIndex(
              (task) => task.name === member.section.name
            );
            if (taskIndex !== -1) {
              const status = item.custom_fields.find(
                (field) => field.gid === "1208053337188313"
              );
              const prioridade = item.custom_fields.find(
                (field) => field.gid === "1206778068794451"
              );
              const responsavel = item.custom_fields.find(
                (field) => field.gid === "1207977716334849"
              );
              const porcentagem = item.custom_fields.find(
                (field) => field.gid === "1208012638308323"
              );

              tasks[taskIndex].task.push({
                name: item.name,
                status: status ? status.display_value : "",
                statusColor:
                  status && status.enum_value ? status.enum_value.color : "",
                porcentagem: porcentagem.display_value,
                prioridade: prioridade ? prioridade.display_value : "",
                prioridadeColor:
                  prioridade && prioridade.enum_value
                    ? prioridade.enum_value.color
                    : "",
                completed: item.completed,
                start_on: item.start_on,
                due_on: item.due_on,
                other: responsavel.multi_enum_values.map((item) => item.name),
              });

              if (item.completed) {
                tasks[taskIndex].media++;
              }
            }
          }
        });
      });

      console.log(tasks);
      preencherScrollableSection(tasks);
    })
    .catch((err) => console.error(err));
}

getData();

function preencherScrollableSection(sections) {
  const scrollableSection = document.getElementById("scrollableSection");
  scrollableSection.innerHTML = "";

  sections.forEach((item) => {
    const containerScroll = document.createElement("div");
    containerScroll.className = "container_scroll";

    const h2 = document.createElement("h2");
    h2.textContent = item.name;

    if (item.task && item.task.length > 0) {
      const conclusaoSpan = document.createElement("span");
      conclusaoSpan.textContent = `Conclusão: ${(
        (item.media / item.task.length) *
        100
      ).toFixed(2)}%`;
      h2.appendChild(conclusaoSpan);
    }

    const duracaoSpan = document.createElement("span");
    duracaoSpan.textContent = `Duração: ${formatarData(
      item.start
    )} - ${formatarData(item.end)}`;
    h2.appendChild(duracaoSpan);

    containerScroll.appendChild(h2);

    item.task.forEach((task) => {
      const container = document.createElement("div");
      container.className = `container ${task.completed ? "completed" : ""} ${
        task.statusColor
      }`;

      const spanNome = document.createElement("span");
      const icon = document.createElement("i");
      icon.className = task.completed ? "fas fa-check-circle" : "far fa-circle";
      spanNome.appendChild(icon);
      spanNome.appendChild(document.createTextNode(` ${task.name}`));
      container.appendChild(spanNome);

      const containerResponsavel = document.createElement("div");
      containerResponsavel.className = "container_responsavels";

      task.other.forEach((other) => {
        const spanResponsavel = document.createElement("span");
        spanResponsavel.className = "responsavel";
        spanResponsavel.textContent = other;
        containerResponsavel.appendChild(spanResponsavel);
      });

      const spanStatus = document.createElement("span");
      spanStatus.className = "status";
      spanStatus.textContent = task.status;
      spanStatus.style.fontWeight =
        task.status === "Em execução" ? "800" : "600";
      containerResponsavel.appendChild(spanStatus);

      const spanPrioridade = document.createElement("span");
      spanPrioridade.className = "status";
      spanPrioridade.textContent = task.prioridade;
      spanPrioridade.style.backgroundColor = task.prioridadeColor;
      containerResponsavel.appendChild(spanPrioridade);

      const spanPorcentagem = document.createElement("span");
      spanPorcentagem.className = "status";
      spanPorcentagem.textContent = `${(task.porcentagem * 100).toFixed(2)}%`;
      containerResponsavel.appendChild(spanPorcentagem);

      container.appendChild(containerResponsavel);

      const divData = document.createElement("div");
      divData.className = "data";
      divData.innerHTML = `
        <span>${formatarData(task.start_on)}</span>
        <span> - </span>
        <span>${formatarData(task.due_on)}</span>
      `;
      container.appendChild(divData);

      containerScroll.appendChild(container);
    });

    scrollableSection.appendChild(containerScroll);
  });
}

function formatarData(data) {
  const options = { day: "numeric", month: "short" };
  console.log(data);
  if (data != null) {
    return new Date(data).toLocaleDateString("pt-BR", options);
  } else {
    return "";
  }
}

// setInterval(() => {
//   getData();
// }, 10000);

function getRgbColor(statusColor) {
  switch (statusColor) {
    case "orange":
      return "rgb(236, 141, 113)";
    case "blue":
      return "rgb(69, 115, 210)";
    case "blue-green":
      return "rgb(78, 203, 196)";
    case "yellow-green":
      return "rgb(179, 223, 151)";
    case "red":
      return "rgb(240, 106, 106)";
    case "yellow":
      return "rgb(248, 223, 114)";
    case "green":
      return "rgb(131, 201, 169)";
    case "yellow-orange":
      return "rgb(241, 189, 108)";
    case "aqua":
      return "rgb(158, 231, 227)";
    case "indigo":
      return "rgb(166, 159, 243)";
    case "purple":
      return "rgb(205, 149, 234)";
    case "magenta":
      return "rgb(249, 170, 239)";
    case "hotpink":
      return "rgb(242, 111, 178)";
    case "pink":
      return "rgb(252, 151, 154)";
    case "cool-gray":
      return "rgb(109, 110, 111)";
    default:
      return "rgb(112, 111, 111)";
    case "secao-1":
      return "rgb(242, 111, 178)";
    case "secao-2":
      return "rgb(205, 149, 234)";
    case "secao-3":
      return "rgb(69, 115, 210)";
    case "secao-4":
      return "rgb(249, 170, 239)";
  }
}

function loadCharge() {
  // setup
  const data = {
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: "",
        data: datas,
        backgroundColor: (ctx) => {
          return getRgbColor(datas[ctx.index].prioridadeColor);
        },
        borderSkipped: false,
        borderRadius: 5,
        barPercentage: 0.8,
      },
    ],
  };

  // todayLine plugin block
  const todayLine = {
    id: "todayLine",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right },
        scales: { x, y },
      } = chart;

      ctx.save();

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgb(102, 102, 102)";
      ctx.setLineDash([6, 6]);
      ctx.moveTo(x.getPixelForValue(new Date()) + 3, top);
      moveScroll = x.getPixelForValue(new Date()) + 3;
      ctx.lineTo(x.getPixelForValue(new Date()) + 3, bottom);
      x.getPixelForValue(new Date()) + 3, top;
      ctx.stroke();
      ctx.restore();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgb(102, 102, 102)";
      ctx.moveTo(x.getPixelForValue(new Date()) + 3, top);
      ctx.lineTo(x.getPixelForValue(new Date()) + 3 - 6, top - 6);
      ctx.lineTo(x.getPixelForValue(new Date()) + 3 + 6, top - 6);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(102, 102, 102, 1)";
      ctx.fillText("Hoje", x.getPixelForValue(new Date()) + 3, top - 10);
      ctx.restore();
    },
  };

  //status plugin block
  const statusField = {
    id: "statusField",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        options,
        chartArea: { top, bottom, left, right },
        scales: { x, y },
      } = chart;

      ctx.save();
      ctx.textBaseline = "middle";
      // ctx.textAlign = 'center';
      data.datasets[0].data.forEach((item, index) => {
        if (item.completed) {
          ctx.fillStyle = "black";
        } else {
          ctx.fillStyle = getRgbColor(item.statusColor);
        }
        ctx.font = `bolder 12px ${
          item.completed ? "FontAwesome" : "sans-serif"
        }`;
        ctx.fillText(
          item.completed ? "\uf00c" : item.status,
          right + 10,
          y.getPixelForValue(index)
        );
        ctx.fillStyle = "black";
        ctx.font = "normal 12px sans-serif";
        ctx.fillText("Status", right + 40, top - 15);
      });
      ctx.restore();
    },
  };

  const customEvent = {
    id: "customEvent",
    afterEvent(chart, args, pluginOptions) {
      if (args.event.type === "click") {
        const elements = chart.getElementsAtEventForMode(
          args.event,
          "nearest",
          { intersect: true },
          true
        );

        if (elements.length) {
          const elementIndex = elements[0].index; // Índice do elemento clicado
          const label = chart.data.labels[elementIndex]; // A label correspondente ao índice
          switchData(label);
        }
      }
    },
  };

  // assignedTasks plugin block
  const assignedTasks = {
    id: "assignedTasks",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right },
        scales: { x, y },
      } = chart;
      ctx.save();
      ctx.font = "bolder 12px sans-serif";
      ctx.fillStyle = "black";
      ctx.textBaseline = "middle";
      // ctx.textAlign = 'left';
      data.datasets[0].data.forEach((item, index) => {
        ctx.fillText(item.name, 10, y.getPixelForValue(index));
      });
      ctx.restore();
    },
  };

  // config
  const config = {
    type: "bar",
    data,
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          // left: 100,
          // bottom: 1.8,
          // right: 100,
        },
      },
      indexAxis: "y",
      scales: {
        x: {
          position: "top",
          // offset: true,
          type: "time",
          grid: {
            // offset: true
          },
          time: {
            unit: selectedValue,
            // displayFormats: {
            //   day: "dd",
            // },
          },
          // min: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
          //   .toString()
          //   .padStart(2, "0")}-01`,
          // max: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
          //   .toString()
          //   .padStart(2, "0")}-${new Date(
          //   new Date().getFullYear(),
          //   new Date().getMonth() + 1,
          //   0
          // ).getDate()}`,
          min: "2024-01-01",
          max: "2024-12-30",
        },
        y: {
          ticks: {
            display: false,
          },
          grid: {
            drawTicks: false,
            drawBorder: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            // title: (ctx) => {
            //   const startDate = new Date(ctx[0].raw.x[0]);
            //   const endDate = new Date(ctx[0].raw.x[1]);
            //   const formattedStartDate = startDate.toLocaleDateString([], {
            //     year: "numeric",
            //     month: "short",
            //     day: "numeric",
            //   });
            //   const formattedEndDate = endDate.toLocaleDateString([], {
            //     year: "numeric",
            //     month: "short",
            //     day: "numeric",
            //   });
            //   return [
            //     `${ctx[0].label}`,
            //     `Intervalo: ${formattedStartDate} - ${formattedEndDate}`,
            //   ];
            // },
          },
        },
      },
    },
    plugins: [todayLine, customEvent], //assignedTasks, statusField,
  };
  if (myChart && myChart.destroyed) {
    myChart.update();
  } else {
    myChart = new Chart(document.getElementById("myChart"), config);
  }
}

function loadCharge2() {
  // setup
  datas_2 = datas.map((item) => {
    return { ...item, x: [] }; // Cria um novo objeto com 'x' como um array vazio
  });

  const data = {
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: "Weekly Sales",
        data: datas_2,
        borderSkipped: false,
        borderRadius: 0,
        // barPercentage: 0.5,
      },
    ],
  };

  // todayLine plugin block
  const todayLine = {
    id: "todayLine",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right },
        scales: { x, y },
      } = chart;

      ctx.save();

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 26, 104, 1)";
      ctx.setLineDash([6, 6]);
      ctx.moveTo(x.getPixelForValue(new Date()), top);
      ctx.lineTo(x.getPixelForValue(new Date()), bottom);
      ctx.stroke();
    },
  };

  const customEvent = {
    id: "customEvent",
    afterEvent(chart, args, pluginOptions) {
      const event = args.event;
      if (event.type == "click") {
      }
    },
  };

  //status plugin block
  const statusField = {
    id: "statusField",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        options,
        chartArea: { top, bottom, left, right },
        scales: { x, y },
      } = chart;

      ctx.save();
      ctx.textBaseline = "middle";
      // ctx.textAlign = 'center';
      data.datasets[0].data.forEach((item, index) => {
        if (item.completed) {
          ctx.fillStyle = "black";
        } else {
          ctx.fillStyle = getRgbColor(item.statusColor);
        }
        ctx.font = `bolder 12px ${
          item.completed ? "FontAwesome" : "sans-serif"
        }`;
        ctx.fillText(
          item.completed ? "\uf00c" : item.status,
          right + 10,
          y.getPixelForValue(index)
        );
        ctx.fillStyle = "black";
        ctx.fillText("S t a t u s", right + 40, top - 15);
      });
      ctx.restore();
    },
  };

  // assignedTasks plugin block
  const assignedTasks = {
    id: "assignedTasks",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right },
        scales: { x, y },
      } = chart;
      ctx.save();
      ctx.font = "bolder 12px sans-serif";
      ctx.fillStyle = "black";
      ctx.textBaseline = "middle";
      // ctx.textAlign = 'left';
      data.datasets[0].data.forEach((item, index) => {
        //   ctx.fillText(item.name, 10, y.getPixelForValue(index));
        ctx.fillText("teste", 10, y.getPixelForValue(index));
      });
      ctx.restore();
    },
  };

  const config = {
    type: "bar",
    data,
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 28,
          bottom: 17,
          // left: 30,
        },
      },
      indexAxis: "y",
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            drawTicks: false,
          },
          position: "top",
          type: "time",
          time: {
            unit: selectedValue,
          },
          min: "2024-09-30",
          max: "2024-09-30",
        },
        y: {
          afterFit: (ctx) => {
            ctx.width = 300;
          },
          ticks: {
            crossAlign: "near",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
    plugins: [],
  };
  if (myChart2 && myChart2.destroyed) {
    myChart2.update();
  } else {
    myChart2 = new Chart(document.getElementById("myChart2"), config);
    document.querySelector(".colSmall").style.width = "600px";
    setTimeout(() => {
      document.getElementsByClassName("colLarge")[0].scrollLeft =
        moveScroll - 300;
      var max = document.querySelector(".colLarge").scrollWidth;
      slider.max = max;
      slider.value = moveScroll - 300;
    }, 1000);
  }
  slider.oninput = function () {
    document.getElementsByClassName("colLarge")[0].scrollLeft = this.value;
  };
  mudarLayout();
}
