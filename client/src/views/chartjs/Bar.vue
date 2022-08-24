<script>
    import { Bar } from 'vue-chartjs'
    export default {
        extends: Bar,
        props: ['data'],
        data() {
            return {
                datacollection: {
                    labels: this.data.labels,
                    datasets: [{
                        barThickness:100,
                        data: this.data.datasets,
                        backgroundColor:'rgba(145, 46, 252, 0.4)',
                        borderColor:"rgba(145, 46, 252, 0.6)",
                        borderWidth: 3,
                        hoverBackgroundColor:"rgba(145, 46, 252, 0.6)"
                    }]
                },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'linear'
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    yAxes: [{ticks: { beginAtZero: true, stepSize: 5,}}],
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: 'index'
                },
            }
        }
        },
        mounted () {
            console.log(this.data.labels)
            this.renderChart(this.datacollection, this.options)
        }
    }
</script>

<style>
</style>