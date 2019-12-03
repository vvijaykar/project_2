var url = "/data/behavior"



d3.json(url).then(function(data){

    var fes = data.FES;
    console.log(fes.length)
    var nofes = data.NoFES;
    console.log(nofes)

    var chart = c3.generate({
        bindto: '#my_dataviz2',
        data: {
            columns: [
                data.FES,
                data.NoFES
            ],
            type: 'bar',
            axes: {
                FES_Present: 'y',
                No_FES_Present: 'y',
                Z_Score: 'y2'
            }
        },
        size: {
            height: 500,
            width: 900
        },
        axis: {
            x: {
                type: 'category',
                categories: data.Behavior,
                tick: {
                    rotate: 75,
                    multiline: false
                },
                height: 200
            },
            y: {
                label: {
                    text: 'Percent of Time Behavior Demonstrated',
                    position: 'outer-middle'
                }
            },
            y2: {
                show: true,
                label: {
                    text: 'Z-Score',
                    position: 'outer-middle'
                }
            }
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
        },
    });
    
    setTimeout(function () {
        chart.load({
            columns: [
                ['Z_Score', 1.72, 3.07, 4.06, 4.85, 4.02, 2.39, 7.51, 5.20, 3.67, 5.40, 3.79, 1.18, 5.20, 3.65, 2.70, 5.95, 2.21, 2.85, 6.50, 6.62, 2.63]
            ]
        });
    }, 1000);

});    