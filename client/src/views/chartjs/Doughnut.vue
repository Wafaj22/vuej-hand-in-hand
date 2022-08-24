<script>
    import {Doughnut} from 'vue-chartjs'

    export default {
        extends: Doughnut,
        props: ["data"],
        data: () => ({
            datacollection : {
                datasets: [{
                    data: [10000, 2000],
                    backgroundColor: ["#7366ff", "#f73164", "#51bb25"],
                }],
                labels: ['stripe', 'paypal'],
            },
                options: {
                animation: {
                    duration: 1000,
                    easing: 'linear'
                },
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },


            }
        }),

        mounted () {
            this.renderChart(this.datacollection, this.options)
        }
    }
</script>

<style>
</style>