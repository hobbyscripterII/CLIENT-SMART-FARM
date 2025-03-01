// AJAX 로직 구현 전까지 사용할 더미 데이터
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

function getChartData(type) {
    // 이전 차트 초기화
    const defaultHtml = '<div class="cell" id="dashboard-cell-0"></div>';
    $('#container').html(defaultHtml);

    const chartDataInfo = getChartDataInfo(type);
    const publicName = chartDataInfo.publicName;
    const valueSuffix = chartDataInfo.valueSuffix;
    const data = chartDataInfo.data;

    console.log('chartDataInfo = ', chartDataInfo);

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
            }
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
}

function getChartDataInfo(type) {
    let chartInfoClass = {};

    switch(type) {
        case 'temp' :
            chartInfoClass = {
                publicName : '온도',
                data : parseData.datasets[0].data,
                valueSuffix : parseData.datasets[0].unit,
            };
            break;
            
        case 'humi' :
            chartInfoClass = {
                publicName : '습도',
                data : parseData.datasets[1].data,
                valueSuffix : parseData.datasets[1].unit,
            };
            break;
            
            case 'open' :
            chartInfoClass = {
                publicName : '개폐량',
                data : parseData.datasets[2].data,
                valueSuffix : parseData.datasets[2].unit,
            };
            break;
            
            case 'light' :
            chartInfoClass = {
                publicName : '일조량',
                data : parseData.datasets[3].data,
                valueSuffix : parseData.datasets[3].unit,
            };
            break;
            
            default :
            chartInfoClass = {
                publicName : null,
                valueSuffix : null,
                dataSet : null
            };
            break;
    }

    return chartInfoClass;
}