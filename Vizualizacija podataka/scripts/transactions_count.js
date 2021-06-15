var txData;

var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

var txSvg = d3.select("#tx-count-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/transaction-count-per-second.csv",
    function (d) {
        return { date: d3.timeParse("%Y-%m-%d")(d.date), btc: d.btc, eth: d.eth }
    },
    function (data) {
        txData = data;

        var x = d3.scaleTime()
            .domain(d3.extent(txData, function (d) { return d.date; }))
            .range([0, width]);

        txSvg.append("g")
            .attr("class", "axisGray")
            .attr("transform", "translate(0," + height + ")")
            .attr("style", "font-size:15px")
            .call(d3.axisBottom(x))

        txSvg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top / 4))
            .attr("fill", "#A6A6A6")
            .attr("font-weight", "bold")
            .style("font-size", "20px")
            .style("text-anchor", "middle")
            .text("Number of transactions per second");

        var yEth = d3.scaleLinear()
            .domain([0, d3.max(txData, function (d) { return +d.eth; })])
            .range([height, 0])

        var btcTxChart = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return yEth(d.btc); });

        txSvg.append("g")
            .attr("class", "axisGray")
            .attr("id", "btcTxAxis")
            .attr("style", "font-size:15px")
            .call(d3.axisLeft(yEth));

        txSvg.append("path")
            .datum(txData)
            .attr("class", "line")
            .attr("id", "btcTxLine")
            .attr("fill", "none")
            .attr("stroke", "#F2A900")
            .attr("stroke-width", 1.5)
            .attr("d", btcTxChart(txData));

        showBtcTxCount = function () {

            if (d3.select("#btc-tx-option").property("checked")) {

                var btcTxChart = d3.line()
                    .x(function (d) { return x(d.date); })
                    .y(function (d) { return yEth(d.btc); });

                txSvg.append("path")
                    .datum(txData)
                    .attr("class", "line")
                    .attr("id", "btcTxLine")
                    .attr("fill", "none")
                    .attr("stroke", "#F2A900")
                    .attr("stroke-width", 1.5)
                    .attr("d", btcTxChart(txData));

            } else if (d3.select("#btc-tx-option").property("checked") == false) {
                d3.select("#btcTxLine").remove()
            }

        }

        showEthTxCount = function () {

            if (d3.select("#eth-tx-option").property("checked")) {

                var ethTxChart = d3.line()
                    .x(function (d) { return x(d.date); })
                    .y(function (d) { return yEth(d.eth); });

                txSvg.append("path")
                    .datum(txData)
                    .attr("id", "ethTxLine")
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", "#716b94")
                    .attr("stroke-width", 1.5)
                    .attr("d", ethTxChart(txData));

            } else {
                d3.select("#ethTxLine").remove()
            }

        }

    })
