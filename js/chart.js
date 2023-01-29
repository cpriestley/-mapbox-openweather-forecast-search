
let c;
const chart = {

    destroy: () => {
        if (c) {
            c.destroy();
        }
    },

    update: (temps) => {
        let ctx = $("#myChart");
        ctx.attr("width", ctx.parent().width());
        ctx.attr("height", ctx.parent().height());
        c = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["12A", "3A", "6A", "9A", "12P", "3P", "6P", "9P"],
                datasets: [{
                    fill: true,
                    backgroundColor: "rgba(100,100,100,1.0)",
                    borderColor: "rgba(0,0,0,1.0)",
                    data: temps.slice(0, 8)
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        gridLines: {display: false}
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: ((value) => {
                                return `${value}°F`
                            })
                        }
                    }
                },
                legend: {display: false}
            }
        });
    },

}

export {chart};