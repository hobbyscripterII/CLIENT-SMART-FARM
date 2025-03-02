function chagePlant(plant) {
    plant = plant.trim();

    // 센서 데이터 초기화
    const sensorDataEl = $('.sensor-data');
    sensorDataEl.html('');

    const sensorDataInfo = getSensorDataInfo(plant);
    const sensorList = {
        'temp' : {name: '온도', unit: '°C'},
        'humi' : {name: '습도', unit: '%'},
        'open' : {name: '개폐량', unit: '%'},
        'light': {name: '일조량', unit: 'LX'}
    };

    Object.entries(sensorList).forEach(([eng, { name, unit }]) => {
        const el = `<div onclick="getChartData('${eng}')">
                        <p class="pb">${name}</p>
                        <span class="${eng}">${sensorDataInfo[eng]}</span><span> ${unit}</span>
                    </div>`;

        sensorDataEl.append(el);
    });

    // nav 효과
    const subPlantEl = $('.sub-plant');

    subPlantEl.each((idx, el) => {
        // 기존 active 효과 제거
        $(el).removeClass('active');

        // 사용자가 키우고 있는 작물명
        const text = $(el).text();

        // 사용자가 클릭한 작물명이랑 일치할 경우 active 클래스 추가
        if(plant == text) {
            $(el).addClass('active');
        }
    });

    const defaultChartDataType = 'temp';
    getChartData(defaultChartDataType);
}

function getChartData(type) {
    // 이전 차트 초기화
    const defaultHtml = '<div class="cell" id="dashboard-cell-0"></div>';
    $('#container').html(defaultHtml);

    const chartDataInfo = getChartDataInfo(type);
    const publicName = chartDataInfo.publicName;
    const valueSuffix = chartDataInfo.valueSuffix;
    const tickInterval = chartDataInfo.tickInterval;

    // dashboards-sync
    /*
    Highcharts.setOptions({
        chart: {
            type: 'area',
            spacingTop: 20,
            spacingBottom: 20,
        },
        title: {
            align: 'left',
            margin: 0,
            x: 30
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: parseData.xData,
            crosshair: true,
            labels: {
                format: '{value}'
            },
            accessibility: {
                // description: 'Kilometers',
                // rangeDescription: '0km to 6.5km'
            }
        },
        yAxis: {
            title: {
                text: null
            },
            tickInterval: tickInterval
        },
        marker: {
            enabled: false
        },
        tooltip: {
            positioner: function () {
                return {
                    x: this.chart.chartWidth - this.label.width,
                    y: 10
                };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '{point.y}',
            headerFormat: '',
            shadow: false,
            valueDecimals: 0
        }
    });
    */
    
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'activity-data',
                type: 'JSON',
                options: {
                    beforeParse: function (data) {
                        return [
                            data.xData,
                            data.datasets.find(d => d.name === publicName).data,
                        ];
                    },
                    data: parseData,
                    // dataUrl: 'https://www.highcharts.com/samples/data/activity.json',
                    firstRowAsNames: false,
                    orientation: 'columns',
                    columnNames: ['x', publicName]
                }
            }]
        },
        components: [{
            connector: {
                id: 'activity-data',
                columnAssignment: [{
                    seriesId: publicName,
                    data: ['x', publicName]
                }]
            },
            renderTo: 'dashboard-cell-0',
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            chartOptions: {
                title: {
                    text: publicName
                },
                tooltip: {
                    valueDecimals: 1,
                    valueSuffix: valueSuffix
                },
                series: [{
                    type: 'line',
                    id: publicName
                }]
            }
        }]
    }, true);

    // area-chart(demo)
    Highcharts.chart('container', {
       chart: {
            type: 'area'
        },
        title: {
            text: publicName
        },
        xAxis: {
            categories: parseData.xData,
            crosshair: true,
            labels: {
                format: '{value}'
            },
            accessibility: {
                // description: 'Kilometers',
                // rangeDescription: '0km to 6.5km'
            }
        },
        yAxis: {
            title: {
                text: null
            },
            tickInterval: tickInterval
        },
        tooltip: {
            pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>' +
            'warheads in {point.x}',
            valueSuffix: valueSuffix
        },
        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            /* name: 'USA' */
            data: [
                null, null, null, null, null, 2, 9, 13, 50, 170, 299, 438, 841,
                1169, 1703, 2422, 3692, 5543, 7345, 12298, 18638, 22229, 25540,
                28133, 29463, 31139, 31175, 31255, 29561, 27552, 26008, 25830,
                26516, 27835, 28537, 27519, 25914, 25542, 24418, 24138, 24104,
                23208, 22886, 23305, 23459, 23368, 23317, 23575, 23205, 22217,
                21392, 19008, 13708, 11511, 10979, 10904, 11011, 10903, 10732,
                10685, 10577, 10526, 10457, 10027, 8570, 8360, 7853, 5709, 5273,
                5113, 5066, 4897, 4881, 4804, 4717, 4571, 4018, 3822, 3785, 3805,
                3750, 3708, 3708, 3708, 3708
            ]
        }]
    });
}

// 더미 데이터
const returnData = `
                        {
                            "xData": [
                                "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
                                "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
                                "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
                            ],
                            "datasets": [
                                {
                                    "name": "온도",
                                    "data": [22.5, 22.0, 21.8, 21.5, 21.0, 20.5, 21.0, 22.5, 24.0, 25.5, 26.5, 27.0, 27.5, 27.2, 26.8, 26.0, 25.0, 24.5, 24.2, 24.0, 23.8, 23.5, 23.2, 24.5],
                                    "unit": "°C",
                                    "type": "line",
                                    "valueDecimals": 1
                                },
                                {
                                    "name": "습도",
                                    "data": [70, 72, 74, 75, 76, 75, 73, 70, 68, 66, 65, 63, 62, 60, 59, 60, 62, 64, 66, 67, 68, 69, 70, 65],
                                    "unit": "%",
                                    "type": "area",
                                    "valueDecimals": 0
                                },
                                {
                                    "name": "개폐량",
                                    "data": [0, 0, 0, 10, 20, 30, 20, 10, 5, 0, 0, 0, 0, 0, 10, 20, 30, 40, 50, 40, 30, 10, 0, 0],
                                    "unit": "%",
                                    "type": "area",
                                    "valueDecimals": 0
                                },
                                {
                                    "name": "일조량",
                                    "data": [0, 0, 0, 0, 0, 0, 20, 50, 100, 200, 400, 600, 800, 900, 1000, 1000, 1000, 900, 800, 600, 400, 100, 30, 30],
                                    "unit": "LX",
                                    "type": "line",
                                    "valueDecimals": 0
                                }
                            ]
                        }
                   `;

const parseData = JSON.parse(returnData);

function getChartDataInfo(type) {
    let chartInfoClass = {};

    switch(type) {
        case 'temp' :
            chartInfoClass = {
                publicName : '온도',
                data : parseData.datasets[0].data,
                valueSuffix : parseData.datasets[0].unit,
                tickInterval : 2
            };
            break;
            
        case 'humi' :
            chartInfoClass = {
                publicName : '습도',
                data : parseData.datasets[1].data,
                valueSuffix : parseData.datasets[1].unit,
                tickInterval : 2
            };
            break;
            
            case 'open' :
            chartInfoClass = {
                publicName : '개폐량',
                data : parseData.datasets[2].data,
                valueSuffix : parseData.datasets[2].unit,
                tickInterval : 5
            };
            break;
            
            case 'light' :
            chartInfoClass = {
                publicName : '일조량',
                data : parseData.datasets[3].data,
                valueSuffix : parseData.datasets[3].unit,
                tickInterval : 200
            };
            break;
            
            default :
            chartInfoClass = {
                publicName : null,
                valueSuffix : null,
                dataSet : null,
                tickInterval : 0
            };
            break;
    }

    return chartInfoClass;
}

function getSensorDataInfo(plant) {
    let sensorData = {};

    switch(plant) {
        case '방울 토마토' :
            sensorData = {
                temp : '24.5',
                humi : '65',
                open : '10',
                light : '30'
            };
            break;

        case '고수' :
            sensorData = {
                temp : '27.5',
                humi : '60',
                open : '0',
                light : '70'
            };
            break;

        case '딸기' :
            sensorData = {
                temp : '10',
                humi : '20',
                open : '80',
                light : '60'
            };
            break;

        case '바질' :
            sensorData = {
                temp : '20',
                humi : '10',
                open : '50',
                light : '10'
            };
            break;

        default :
            sensorData = {
                temp : 0,
                humi : 0,
                open : 0,
                light : 0
            };
            break;
    }

    return sensorData;
}