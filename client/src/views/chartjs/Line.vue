<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["data"],
  data() {
    return {
      linechart: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            backgroundColor: "rgba(247, 49, 100, 0.3)",
            borderColor: "rgba(247, 49, 100, 0.8)",
            strokeColor: "#f73164",
            pointBackgroundColor: "#f73164",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#000",
            pointHoverBorderColor: "#000",
            pointHighlightStroke: "rgba(30, 166, 236, 1)",
            data: this.data,
          },
        ],
      },
      options: {
        animation: {
          duration: 1000,
          easing: "linear",
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, stepSize: 5 } }],
          xAxes: [{ barThickness: 39 }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.linechart, this.options);
  },
};
</script>

<style>
</style>