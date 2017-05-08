// Global variables
var repoSelected = null;
var userSelected = null;
var firstClick = null;
var secondClick = null;
var choiceSelected = 'commits';
var sizeSelected = 'commits';

// Data Variables
var rawdata = null;
var uniTimeSeries = null;
var numOfDays = 0;
var extentOfDays = [];
var heatMapPadding = 100;
var cellLimit = 60;
var buckets = 9;
var buckets_tree = 7;
var extentVals = null;
// var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

var nameMapperObj = {"External": "External User", 
                    "proteomics-developers": "General PRIDE developer",
                    "mbdebian": "Manuel Bernal",
                    "ypriverol": "Yasset Perez-Riverol",
                    "fcyu": "fcyu",
                    "Tobias-Ternent": "Tobias Ternent",
                    "noedelta": "Noemi del Toro",
                    "olgavrou": "olgavrou",
                    "julianu":"julianu",
                    "gmlewis":"gmlewis",
                    "tomas-pluskal":"tomas-pluskal",
                    "attilacsordas":"Attila Csordas",
                    "pride-mod":"PRIDE Modification Lib",
                    "pride-utilities":"PRIDE Utilities",
                    "ms-data-core-api":"PRIDE Data Core Lib",
                    "pride-protein-inference": "Protein Inference Lib",
                    "protein-details-fetcher": "Protein Details Fetcher",
                    "pride-jaxb":"PRIDE XML Parser",
                    "jmzReader":"jmzReader Lib",
                    "jmzml": "jmzML",
                    "protein-accession-resolver":"Protein Details Fetcher",
                    "jmzTab":"jmzTab",
                    "xxindex": "Indexing Files",
                    "jmzIdentML":"jmzIdentML",
                    "ols-client":"OLS Client Library",
                    "track-hub-generator":"Track Hub Generator",
                    "jnetCDF":"jnetCDF",
    "pubmed-id-fetcher":"pubmed-id-fetcher",
    "pride-ontology":"pride-ontology",
    "pride-gene-annotation":"pride-gene-annotation",
    "pride-utilities.github.io":"PRIDE Utilities Web","pride-utilities-files":"PRIDE Utilities Examples",
    "pride-schema-validator":"pride-schema-validator"
};


var ReverseMapper = {
    "External User":          "External",
    "General PRIDE developer": "proteomics-developers",
    "Manuel Bernal":        "mbdebian",
    "Yasset Perez-Riverol": "ypriverol",
    "fcyu":                 "fcyu",
    "julianu":"julianu",
    "Tobias Ternent":       "Tobias-Ternent",
    "olgavrou":             "olgavrou",
    "Noemi del Toro":       "noedelta",
    "gmlewis":"gmlewis",
    "tomas-pluskal":"tomas-pluskal",
    "Attila Csordas": "attilacsordas",
    "PRIDE Modification Lib":"pride-mod",
    "PRIDE Utilities": "pride-utilities",
    "PRIDE Data Core Lib": "ms-data-core-api",
    "Protein Inference Lib":"pride-protein-inference",
    "Protein Details Fetcher": "protein-details-fetcher" ,
    "PRIDE XML Parser":"pride-jaxb",
    "jmzReader Lib": "jmzReader",
    "jmzML": "jmzml",
    "Protein Details Fetcher": "protein-accession-resolver",
    "jmzTab":"jmzTab",
    "Indexing Files": "xxindex" ,
    "jmzIdentML":"jmzIdentML",
    "OLS Client Library": "ols-client",
    "Track Hub Generator": "track-hub-generator",
    "jnetCDF":"jnetCDF",
    "pubmed-id-fetcher":"pubmed-id-fetcher",
    "pride-ontology":"pride-ontology",
    "pride-gene-annotation":"pride-gene-annotation",
    "PRIDE Utilities Web": "pride-utilities.github.io",
    "PRIDE Utilities Examples": "pride-utilities-files",
    "pride-schema-validator":"pride-schema-validator"
}

// Get Choice Function

function getChoice(){
    if(choiceSelected == 'total'){ return function(d) {return d.values.total;}}
    if(choiceSelected == 'additions'){ return function(d) {return d.values.additions;}}
    if(choiceSelected == 'deletions'){ return function(d) {return d.values.deletions;}}
    if(choiceSelected == 'commits'){ return function(d) {return d.values.count;}}
}

function getChoiceSize(){
    if(sizeSelected == 'total'){ return function(d) {return d.values.total;}}
    if(sizeSelected == 'additions'){ return function(d) {return d.values.additions;}}
    if(sizeSelected == 'deletions'){ return function(d) {return d.values.deletions;}}
    if(sizeSelected == 'commits'){ return function(d) {return d.values.count;}}
}

function getChoiceValue(d){
    if(choiceSelected == 'total'){ return d.total;}
    if(choiceSelected == 'additions'){ return d.additions;}
    if(choiceSelected == 'deletions'){ return d.deletions;}
    if(choiceSelected == 'commits'){ return d.count;}
}


function init(){

    $(".infoButton").colorbox({width:"80%", height:"80%"});
    
    // General Initializations
    parsetimestamp = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;
    parsedatestamp = d3.time.format("%Y-%m-%d").parse;
    color = d3.scale.category20();

    margin = {top: 20, right: 20, bottom: 40, left: 30};
    // margin_map = {top: 5, right: 5, bottom: 30, left: 150};
    margin_map = margin;
    windowwidth = d3.select('body').style('width').replace('px','');
    windowheight = Math.max(d3.select('body').style('height').replace('px',''), 900);

    width = windowwidth - margin.left - 4*margin.right;
    height = windowheight - margin.top - margin.bottom;
    w2 = windowwidth - margin_map.left - 4*margin_map.right;
    
    // console.log(width);
    // console.log(height);
    
    height_single = height/4;
    height_brush_div = height/16;
    width_half = width/2.1;

    // ----------------------------- //
    // ----------------------------- //

    // Timeline Initializations

    timeDiv = d3.select("#timeline-div")
        .style("position", "relative")
        .style("width", width + "px")
        .style("height", height_single + "px")
        // .style("left", margin.left + "px")   
        // .style("margin-bottom", margin.bottom + "px")
        // .style("top", margin.top + "px");

    xScaleTimeLine = d3.time.scale()
        .range([0, width]);

    yScaleTimeLine = d3.scale.linear()
        .range([0, height_single]);
    
    xAxisTimeLine = d3.svg.axis()
        .scale(xScaleTimeLine)
        .orient('bottom')
        // .ticks(d3.time.days, 1)
        // .tickFormat(d3.time.format('%a %d'))
        .tickSize(5,1)
        .tickPadding(8);

    yAxisTimeLine = d3.svg.axis()
        .scale(yScaleTimeLine)
        .orient('left')
        .tickSize(5,1)
        .tickFormat(d3.format('s'))
        .tickPadding(8);
    
    timeSvg = timeDiv.append('svg')
        .attr("width", width + "px")
        .attr("height", height_single + margin.top + margin.bottom)
        .attr('class', 'timeSvgClass')
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    timeSvgYaxis = timeSvg.append('svg:g')
        .attr('class', 'axis')

    timeSvgXaxis = timeSvg.append('svg:g')
        .attr('transform', 'translate('+ (0) +','+ height_single+')')
        .attr('class', 'axis')
    
    timeLineLegendSvg = d3.select('#time-line-legend').append('svg')
        .attr('height', 60 + "px")

    // ----------------------------- //
    // ----------------------------- //

    // TimeLine Brush Initializatoin
    timeBrushDiv = d3.select("#timeline-brush-div")
        .style("position", "relative")
        .style("width", width + "px")
        .style("height", height_brush_div + margin.top + margin.bottom + "px")
        .style("top", margin.top + "px");

    xScaleTimeBrush = d3.time.scale()
        .range([0, width]);

    yScaleTimeBrush = d3.scale.linear()
        .range([0, height_brush_div]);

    xAxisTimeBrush = d3.svg.axis()
        .scale(xScaleTimeBrush)
        .orient('bottom')
        .tickSize(5,1)
        .tickPadding(8);

    brush = d3.svg.brush()
        .x(xScaleTimeBrush)
        .on("brush", brushed);

    timeBrushSvg = timeBrushDiv.append('svg')
        .attr("width", width + "px")
        .attr("height", height_brush_div + margin.top + margin.bottom)
        .attr('class', 'timeBrushSvgClass')
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    timeBrushSvgXaxis = timeBrushSvg.append('svg:g')
        .attr('transform', 'translate('+ (0) +','+ height_brush_div +')')
        .attr('class', 'axis')

    timeBrushSvgContext = timeBrushSvg.append('svg:g')

    timeBrushSvgContext.append("g")
            .attr("class", "x brush")
        .selectAll("rect")
            .attr("y", -6)
            .attr("height", height_brush_div + 7);

    // timeBrushSvg.append("text")
    //     .attr("class", "x_label")
    //     .attr("text-anchor", "middle")
    //     .attr("x", width/2.0)
    //     .attr("y", height_brush_div + 35)
    //     .text("Time Axis");

    // ----------------------------- //
    // ----------------------------- //

    // RepoMap Initialization
    repoMapDiv = d3.select("#treemap-repo-div")
        .style("position", "relative")
        .style("width", width_half + "px")
        .style("height", (height/3) + margin.top + margin.bottom + "px")
        .style("top", margin.top + "px")
        .style('border', '1px solid');

    repoTreeMap = d3.layout.treemap()
        .size([(width_half), ((height/3) + margin.top + margin.bottom)])
        // .sticky(true)
        .children(function(d) { return d.values; })
        .value(getChoice())
        .round(false);

    zscaleRepoMap = d3.scale.quantile()
        .range(colorbrewer.BuGn[buckets_tree]);

    // ----------------------------- //
    // ----------------------------- //

    // UserMap Initialization
    userMapDiv = d3.select("#treemap-user-div")
        .style("position", "relative")
        .style("width", width_half + "px")
        .style("height", (height/3) + margin.top + margin.bottom + "px")
        .style("top", margin.top + "px")
        .style('border', '1px solid');

    userTreeMap = d3.layout.treemap()
        .size([(width_half), ((height/3) + margin.top + margin.bottom)])
        // .sticky(true)
        .children(function(d) { return d.values; })
        .value(getChoice())
        .round(false);

    zscaleUserMap = d3.scale.quantile()
        .range(colorbrewer.Blues[buckets_tree]);

    // ----------------------------- //
    // ----------------------------- //

    // HeatMap Initialization
    heatMapDiv = d3.select("#heatmap-div")
        .style("position", "relative")
        .style("width", w2 + margin_map.left + margin_map.right + "px")
        .style("height", (height/2) + margin.top + margin.bottom + "px")
        .style("top", margin_map.top + "px")
        // .style("left", margin_map.left + "px");
    
    heatMapSvg = heatMapDiv.append('svg')
        .attr('width', w2 + margin_map.left + margin_map.right)
        .attr("height", (height/2) + margin.top + margin.bottom)
        .attr('class', 'heatSvgClass')
        // .attr('transform', 'translate(' + margin_map.left + ',' + margin_map.top + ')');

    xScaleHeatMap = d3.scale.ordinal();        
    yScaleHeatMap = d3.scale.ordinal();
    zscaleHeatMap = d3.scale.quantile()
        .range(colorbrewer.YlGnBu[9]);

    xAxisHeatMap = d3.svg.axis()
        .tickSize(3,1)
        .tickPadding(3)
        .orient('bottom');

    yAxisHeatMap = d3.svg.axis()
        .orient('left')
        .tickSize(3,1)
        .tickPadding(3);

    heatSvgYaxis = heatMapSvg.append('svg:g')
        .attr("class", "axis")
        .attr('transform', 'translate('+ heatMapPadding +','+ (0) +')')

    heatSvgXaxis = heatMapSvg.append('svg:g')
        .attr('id', 'heatSvgXAxisID')
        .attr("class", "axis");
        
    heatSvgLegend = heatMapSvg.append('svg:g')
        .attr('class', 'heatLegendSvgClass')
        .attr('id', 'heatLegendSvgID');

    // ----------------------------- //
    // ----------------------------- //

    // Tooltip Initialization
    tooltip_div = d3.select("body").append("div")   
        .attr("class", "Mytooltip")
        .attr('id', 'tooltip')
        .style("visibility", "hidden");

    d3.select(document)
        .on("mousemove", function() {
            var mouse_x = d3.event.pageX;
            var mouse_y = d3.event.pageY;
            var tooltip_width = d3.select('#tooltip').style('width').replace('px','')
            tooltip_div
                .style("left", mouse_x < windowwidth-400 ? (mouse_x + 20) + "px" : (mouse_x - 20 - tooltip_width) + "px")
                .style("top", (mouse_y - 40) + "px");
        });


    // ----------------------------- //
    // ----------------------------- //

    // Other Initialization
    format = d3.format("0,000");
    d3.select('#select-score').property('checked', true);
    d3.selectAll(".mode-radio").on("change", function() { radioUpdate(this.value);});
    d3.selectAll(".size-radio").on("change", function() { radioUpdateSize(this.value);});


    // Update Page Function
    update();
}


function update(){
  
    // d3.csv('http://sourabhbajaj.com/projects/GithubVisualizer/data/balancedDataFull.csv', function(d) {
    d3.csv('data/balancedDataFull.csv', function(d) {
         //repo  username  type  name  timestamp additions deletions total message userURL repoURL
         return {
           repo: nameMapperObj[d.repo],
           timestamp: d.timestamp.substring(0,10),
           username: nameMapperObj[d.username],
           ietype: +d.type,
           realname: d.name,
           additions: +d.additions,
           deletions: +d.deletions,
           total: +d.total,
           dateob: new Date(d.timestamp.substring(0,10) + " (UTC)"),
           monthob: new Date(d.timestamp.substring(0,7) + " (UTC)"),
           message: d.message,
           userURL: d.userURL,
           repoURL: d.repoURL
         };
       }, renderFunc) 
}


function filterData(extentVals){
    if(!rawdata) {return null};
    
    filteredData = rawdata;
    if(extentVals) {
        filteredData = rawdata.filter(function(d) {
            return d.dateob > extentVals[0] && d.dateob < extentVals[1];
        });
        if(filteredData.length == 0){
            filteredData = rawdata;
            extentVals = xScaleTimeBrush.domain();
        }
    };

    allChartTimeLineNest = d3.nest()
        .key(function(d) {return d.timestamp;})
        .sortKeys(compareDates)
        .rollup(rollLeaves)
        .entries(filteredData);

    if(allChartTimeLineNest.length > 0)
        extentOfDays = [allChartTimeLineNest[0].key, allChartTimeLineNest[allChartTimeLineNest.length-1].key];
    else
        extentOfDays = extentVals;

    numOfDays = moment(extentOfDays[1]).diff(extentOfDays[0], 'days') + 1;

    repoMapDataNest = null;
    userMapDataNest = null;
    heatMapDataNest = null;
    secondChartTimeLineNest = null;
    thirdChartTimeLineNest = null;
    timeLineLegendData = [{key:'PRIDE-Utilities', colorfill:'SteelBlue'}];

    if(!firstClick){
        repoMapDataNest = d3.nest()
            .key(function(d) {return d.repo;})
            .rollup(rollLeaves)
            .entries(filteredData);
            
        userMapDataNest = d3.nest()
            .key(function(d) {return d.username;})
            .rollup(rollLeaves)
            .entries(filteredData);
        
        heatMapDataNest = d3.nest()
            .key(function(d) {return d.repo;})
            .key(function(d) { return determineScale(d.timestamp);})
            .sortKeys(compareDates)
            .rollup(rollLeaves)
            .entries(filteredData);
    }
    
    if(firstClick=='repo'){
        
        filterFirstClickData = filteredData.filter(function(d) {return d.repo == repoSelected;});

        repoMapDataNest = d3.nest()
            .key(function(d) {return d.repo;})
            .rollup(rollLeaves)
            .entries(filteredData);

        userMapDataNest = d3.nest()
            .key(function(d) {return d.username;})
            .rollup(rollLeaves)
            .entries(filterFirstClickData);
        
        secondChartTimeLineNest = d3.nest()
            .key(function(d) {return d.timestamp;})
            .sortKeys(compareDates)
            .rollup(rollLeaves)
            .entries(filterFirstClickData);

        heatMapDataNest = d3.nest()
           .key(function(d) {return d.username;})
           .key(function(d) { return determineScale(d.timestamp);})
           .sortKeys(compareDates)
           .rollup(rollLeaves)
           .entries(filterFirstClickData);
        
        timeLineLegendData.push({key:repoSelected, colorfill:'Lightpink'});

    }
    
    if(firstClick=='user'){

        filterFirstClickData = filteredData.filter(function(d) {return d.username == userSelected;});

        repoMapDataNest = d3.nest()
            .key(function(d) {return d.repo;})
            .rollup(rollLeaves)
            .entries(filterFirstClickData);

        userMapDataNest = d3.nest()
            .key(function(d) {return d.username;})
            .rollup(rollLeaves)
            .entries(filteredData);

        secondChartTimeLineNest = d3.nest()
            .key(function(d) {return d.timestamp;})
            .sortKeys(compareDates)
            .rollup(rollLeaves)
            .entries(filterFirstClickData);

        heatMapDataNest = d3.nest()
           .key(function(d) {return d.repo;})
           .key(function(d) { return determineScale(d.timestamp);})
           .sortKeys(compareDates)
           .rollup(rollLeaves)
           .entries(filterFirstClickData);
           
        timeLineLegendData.push({key:userSelected, colorfill:'Lightpink'});
    }

    if(secondClick){
        filterSecondClickData = filterFirstClickData.filter(function(d) { return d.username == userSelected && d.repo == repoSelected;});

        thirdChartTimeLineNest = d3.nest()
            .key(function(d) {return d.timestamp;})
            .sortKeys(compareDates)
            .rollup(rollLeaves)
            .entries(filterSecondClickData);
        
        var selectEle = secondClick=='user' ? userSelected : repoSelected;
        
        timeLineLegendData.push({key: selectEle, colorfill:'#7FFFD4'});
    }

    repoMapDataNest = {values: repoMapDataNest, key:'repoMap'};
    userMapDataNest = {values: userMapDataNest, key:'userMap'};
    
    objData = new Object();
    // TimeStamp Filters
    objData['all_timeline_data'] = allChartTimeLineNest;
    objData['first_timeline_data'] = secondChartTimeLineNest;
    objData['second_timeline_data'] = thirdChartTimeLineNest;
    objData['time_legend_data'] = timeLineLegendData;

    // Treemap Data Filters
    objData['repo_map_data'] = repoMapDataNest;
    objData['user_map_data'] = userMapDataNest;
    
    //Heatmap Data Filters
    objData['heat_map_data'] = heatMapDataNest;
    
    return objData;
}


function renderFunc(error, csv){
    rawdata = csv;
    console.log(rawdata[0]);

    // Data Manipulation
    var dataobj = filterData(null);
    uniTimeSeries = $.extend(true, [], dataobj.all_timeline_data);
    console.log(dataobj);

    render_routine(dataobj);
    renderTimeBrush();
}

function render_routine(dataobj){
    // Render Funcs
    renderTimeLine(dataobj);
    renderRepoMap(dataobj);
    renderUserMap(dataobj);
    renderFirstSelection(dataobj);
    renderSecondSelection(dataobj);
    renderHeatMap(dataobj);
}

function renderTimeLine(dataobj){

    var timeData = dataobj.all_timeline_data;

    // Scale Domain Set
    xScaleTimeLine.domain([new Date(timeData[0].key), d3.time.day.offset(new Date(timeData[timeData.length - 1].key), 1)]);
    timeDataYvals = timeData.map(getChoice()).sort(d3.ascending);
    // yScaleTimeLine.domain([d3.max(timeData.map(getChoice())), 0]);
    yScaleTimeLine.domain([d3.quantile(timeDataYvals, 1.0), 0]);

    // Add the svg and bar elements
    timeSvgClassSelect = timeSvg.selectAll('.timeSvgClass')
        .data(timeData)
        .enter()
            .append('svg:rect')
            .attr('class','timeAllBar');
        
    // wTemp = width / timeData.length;
    var wTemp = width / timeStampDiff(xScaleTimeLine.domain());

    timeSvg.selectAll('.timeAllBar')
        .data(timeData)
        .transition()
        .attr('class','timeAllBar')
        .attr('x', function(d){return xScaleTimeLine(new Date(d.key));})
        .attr("width", wTemp)
        .attr("y", function(d){return yScaleTimeLine(getChoice()(d));})
        .attr('height', function(d){return height_single - yScaleTimeLine(getChoice()(d));});

    timeSvg.selectAll('.timeAllBar')
        .data(timeData)
        .on("mouseover", function(d){
            tooltip_div       
                .style("visibility", "visible")
                .transition().duration(150)
                .style("opacity", 1);
                var putImageInTooltip = function() {
                    tooltip_div.html(tooltipString(d));    
                }
                putImageInTooltip();
        })
        .on("mouseout",function(){
            tooltip_div.transition()      
                .duration(200)
                .style("opacity", 0);
        });

    timeSvg.selectAll('.timeSvgClass')
        .data(timeData)
        .exit().remove();
    
    timeSvg.selectAll('.timeAllBar')
        .data(timeData)
        .exit().remove();

    timeSvgYaxis.transition().call(yAxisTimeLine);
    timeSvgXaxis.transition().call(xAxisTimeLine);

    var legendWidth = 10;

    timeLegendRect = timeLineLegendSvg.selectAll('.TimeLineLegendRect').data(dataobj.time_legend_data);

    timeLegendRect.exit().remove();
    timeLegendRect
        .enter()
        .append('rect')
        .attr('class', 'TimeLineLegendRect');
    timeLegendRect.transition();

    timeLegendText = timeLineLegendSvg.selectAll('.TimeLineLegendText').data(dataobj.time_legend_data);

    timeLegendText.exit().remove();
    timeLegendText
        .enter()
        .append('text')
        .attr('class', 'TimeLineLegendText');
    timeLegendText.transition();

    timeLegendRect
        .attr("y", function(d, i) { return 2 * legendWidth * i; })
        .attr("x", 0)
        .attr("width", legendWidth)
        .attr("height", legendWidth)
        .style("fill", function(d) { return d.colorfill; })
    
    timeLegendText
        .text(function(d) { return d.key; })
        .attr("y", function(d, i) { return 9 + 2*legendWidth * i; })
        .attr("x", 5 + legendWidth);

}


function renderTimeBrush() {
        // Render Brush TimeSeries
    xScaleTimeBrush.domain(xScaleTimeLine.domain());
    yScaleTimeBrush.domain(yScaleTimeLine.domain());
    
    // Add the svg and bar elements
    timeBrushSvgClassSelect = timeBrushSvg.selectAll('.timeBrushSvgClass')
        .data(uniTimeSeries);
    
    timeBrushSvgClassSelect.exit().remove();

    timeBrushSvgClassSelect.enter()
        .append('svg:rect')
        .attr('class','timeBrushAllBar');

    var wTemp = width / timeStampDiff(xScaleTimeBrush.domain());

    timeBrushSvg.selectAll('.timeBrushAllBar')
        .data(uniTimeSeries)
        .transition()
        .attr('class','timeBrushAllBar')
        .attr('x', function(d){return xScaleTimeBrush(new Date(d.key));})
        .attr("width", wTemp)
        .attr("y", function(d){return yScaleTimeBrush(getChoice()(d));})
        .attr('height', function(d){return height_brush_div - yScaleTimeBrush(getChoice()(d));});

    timeBrushSvgXaxis.transition().call(xAxisTimeBrush);

    timeBrushSvgContext
        .selectAll('.brush')
            .call(brush)
        .selectAll("rect")
            .attr("y", -6)
            .attr("height", height_brush_div + 7);
}


function renderFirstSelection(dataobj){

    var timeData = dataobj.first_timeline_data;
    if (!timeData) {
        timeData = new Array();
    }

    // Add the svg and bar elements
    timeSvgClassSelect = timeSvg.selectAll('.timeSvgClassFirst')
        .data(timeData)
        .enter()
            .append('svg:rect')
            .attr('class','timeFirstBar');

    // wTemp = width / timeData.length;
    var wTemp = width / timeStampDiff(xScaleTimeLine.domain());

    timeSvg.selectAll('.timeFirstBar')
        .data(timeData)
        .transition()
        .attr('class','timeFirstBar')
        .attr('x', function(d){return xScaleTimeLine(new Date(d.key));})
        .attr("width", wTemp)
        .attr("y", function(d){return yScaleTimeLine(getChoice()(d));})
        .attr('height', function(d){return height_single - yScaleTimeLine(getChoice()(d));});

    timeSvg.selectAll('.timeFirstBar')
        .data(timeData)
        .on("mouseover", function(d){
            tooltip_div       
                .style("visibility", "visible")
                .transition().duration(150)
                .style("opacity", 1);
                var putImageInTooltip = function() {
                    tooltip_div.html(tooltipString(d));    
                }
                putImageInTooltip();
        })
        .on("mouseout",function(){
            tooltip_div.transition()      
                .duration(200)
                .style("opacity", 0);
        });

    timeSvg.selectAll('.timeSvgClassFirst')
        .data(timeData)
        .exit().remove();
    
    timeSvg.selectAll('.timeFirstBar')
        .data(timeData)
        .exit().remove();
}


function renderSecondSelection(dataobj){
    
    var timeData = dataobj.second_timeline_data;
    if (!timeData) {
        timeData = new Array();
    }

    // Add the svg and bar elements
    timeSvgClassSelect = timeSvg.selectAll('.timeSvgClassSecond')
        .data(timeData)
        .enter()
            .append('svg:rect')
            .attr('class','timeSecondBar');

    // wTemp = width / timeData.length;
    var wTemp = width / timeStampDiff(xScaleTimeLine.domain());

    timeSvg.selectAll('.timeSecondBar')
        .data(timeData)
        .transition()
        .attr('class','timeSecondBar')
        .attr('x', function(d){return xScaleTimeLine(new Date(d.key));})
        .attr("width", wTemp)
        .attr("y", function(d){return yScaleTimeLine(getChoice()(d));})
        .attr('height', function(d){return height_single - yScaleTimeLine(getChoice()(d));});

    timeSvg.selectAll('.timeSecondBar')
        .data(timeData)
        .on("mouseover", function(d){
            tooltip_div       
                .style("visibility", "visible")
                .transition().duration(150)
                .style("opacity", 1);
                var putImageInTooltip = function() {
                    tooltip_div.html(tooltipString(d));    
                }
                putImageInTooltip();
        })
        .on("mouseout",function(){
            tooltip_div.transition()      
                .duration(200)
                .style("opacity", 0);
        });

    timeSvg.selectAll('.timeSvgClassSecond')
        .data(timeData)
        .exit().remove();
    
    timeSvg.selectAll('.timeSecondBar')
        .data(timeData)
        .exit().remove();
}


function renderRepoMap(dataobj){
    // Repomap Render Function

    repoTreeMap
        .value(getChoice())
    
    var repoData = repoTreeMap.nodes(dataobj.repo_map_data)

    zscaleRepoMap
        .domain([0, buckets_tree-1, d3.max(dataobj.repo_map_data.values.map(getChoiceSize()))])

    nodelinkRepo = repoMapDiv.selectAll(".nodelink")
        .data(repoData)
        .enter()
            .append("a")
        .attr("class", "nodelink")
        .each(function(d) {
            d3.select(this)
                .append("div")
                .attr("class", "node")
                .each(function(d) {
                    d3.select(this)
                        .append("a")
                        .attr("class", "nodeanchor")
                });  
        })
    
    repoMapDiv.selectAll(".nodelink")
        .data(repoData)
        .exit().remove();

    nodeRepo = repoMapDiv.selectAll(".node")
        .data(repoData)
        .exit().remove()

    nodeRepo = repoMapDiv.selectAll(".node")
        .data(repoData)
        .attr("class", "node")
        .transition().call(position)
        .attr("stroke", "#FFF")
        .style("background", function(d) { return d.values ? zscaleRepoMap(getChoiceSize()(d)) : null; });
    
    repoMapDiv.selectAll(".node")
        .data(repoData)
        .on("mouseover", function(d){
            tooltip_div       
                .style("visibility", "visible")
                .transition().duration(150)
                .style("opacity", 1);
                var putImageInTooltip = function() {
                    tooltip_div.html(tooltipString(d));    
                }
                putImageInTooltip();
        })
        .on("mouseout",function(){
            tooltip_div.transition()      
                .duration(200)
                .style("opacity", 0);
        })
        .on("click", function(d){
            repoSelected = d.key;
            if(firstClick == 'repo') {
                secondClick = null;
                d3.selectAll('.createSecondButtons').remove();
                d3.select('#firstClickButtonDiv').html(firstButtonHTML());
            }
            if(!firstClick) {
                firstClick = 'repo';
                d3.select('#firstClickButtonDiv').html(firstButtonHTML());
            }
            if(firstClick != 'repo') {
                secondClick = 'repo';
                d3.select('#secondClickButtonDiv').html(secondButtonHTML());
            }
            brushed();
        });

    nodeAnchorsRepo = repoMapDiv.selectAll(".nodeanchor")
        .data(repoData)
        .html(function(d) { return d.values.total ? d.key : 'No contribution for any repository under this selection' ;})
        .exit().remove();
}


function  renderUserMap(dataobj){
    
    userTreeMap
        .value(getChoice())
    
    // Usermap Render Function
    var userData = userTreeMap.nodes(dataobj.user_map_data)

    zscaleUserMap
        .domain([0, buckets_tree-1, d3.max(dataobj.user_map_data.values.map(getChoiceSize()))])
    // console.log(zscaleUserMap.domain())

    nodelinkUser = userMapDiv.selectAll(".nodelink")
        .data(userData)
        .enter()
            .append("a")
        .attr("class", "nodelink")
        .each(function(d) {
            d3.select(this)
                .append("div")
                .attr("class", "node")
                .each(function(d) {
                    d3.select(this)
                        .append("a")
                        .attr("class", "nodeanchor")
                    });  
        })

    userMapDiv.selectAll(".nodelink")
        .data(userData)
        .exit().remove();

    nodeUser = userMapDiv.selectAll(".node")
        .data(userData)
        .exit().remove()

    nodeUser = userMapDiv.selectAll(".node")
        .data(userData)
        .attr("class", "node")
        .transition().call(position)
        .attr("stroke", "#FFF")
        .style("background", function(d) { return d.values ? zscaleUserMap(getChoiceSize()(d)) : null; });

    userMapDiv.selectAll(".node")
        .data(userData)
        .on("mouseover", function(d){
            tooltip_div       
                .style("visibility", "visible")
                .transition().duration(150)
                .style("opacity", 1);
                var putImageInTooltip = function() {
                    tooltip_div.html(tooltipString(d));    
                }
                putImageInTooltip();
        })
        .on("mouseout",function(){
            tooltip_div.transition()      
                .duration(200)
                .style("opacity", 0);
        })
        .on("click", function(d){
            userSelected = d.key;
            if(firstClick == 'user') {
                secondClick = null;
                d3.selectAll('.createSecondButtons').remove();
                d3.select('#firstClickButtonDiv').html(firstButtonHTML());
            }
            if(!firstClick) {
                firstClick = 'user';
                d3.select('#firstClickButtonDiv').html(firstButtonHTML());
            }
            if(firstClick != 'user') {
                secondClick = 'user';
                d3.select('#secondClickButtonDiv').html(secondButtonHTML());
            }
            brushed();
        });

    nodeAnchorsUser = userMapDiv.selectAll(".nodeanchor")
        .data(userData)
        .html(function(d) { return d.values.total ? d.key : 'No contribution by any user under this selection' ;})
        .exit().remove();

}


function renderHeatMap(dataobj) {

    var data = dataobj.heat_map_data;
    if (!data) { return; }

    yAxisData = data.map(function(d) {return d.key;});
    xAxisData = new Array();
    // console.log(yAxisData)
    // var totalSteps = moment(extentOfDays[1]).diff(extentOfDays[0],'months');
    // var cellSize = computeCellSize(totalSteps, data.length, heatMapPadding);

    cellSize = 17;
    // console.log(data);
    var heatMapData = fillMissingData(data, heatMapPadding, cellSize);
    // console.log(heatMapData);

    var heatMapWidth = heatMapData[0].length * cellSize;
    var heatMapHeight = data.length * cellSize;

    // console.log(xAxisData);

    // X-Axis Scale
    xScaleHeatMap
        .domain(xAxisData)
        .rangePoints([0, heatMapWidth]);

    // Y-Axis Scale
    yScaleHeatMap
        .domain(yAxisData)
        .rangeBands([0, heatMapHeight]);

    // Define the Color Scale
    zscaleHeatMap
        .domain([0, buckets - 1, d3.max(heatMapData.map(function(d) { return d3.max(d, function(e) {return getChoiceValue(e); })}))]);
    // console.log(zscaleHeatMap.domain());
    
    // YAxis Update
    yAxisHeatMap.scale(yScaleHeatMap)    
    heatSvgYaxis.transition().call(yAxisHeatMap);

    heatMapXAxis = heatSvgXaxis.selectAll('.heatXAxis').data(xAxisData);

    heatMapXAxis.exit().remove();
    heatMapXAxis
        .enter()
            .append('text')
            .attr('class', 'heatXAxis');
    
    heatMapXAxis
        .transition()
        .attr("x", function(d, i) { return (4*i*cellSize); })
        .attr("y", heatMapHeight)
        .attr("transform", "translate(" + heatMapPadding + ", 12)")
        .attr('text-anchor', "start")
        .text(function(d) {return d;});

    // Row Stuff
    heatMapRow = heatMapSvg.selectAll(".heatMapRow").data(heatMapData);
    
    heatMapRow.enter()
        .append("svg:g")
        .attr("class", "heatMapRow");

    heatMapRow.exit().remove();
    heatMapRow.transition();
    
    heatMapCell = heatMapRow.selectAll('.heatMapCell').data(function(d) { return d;} )
    
    heatMapCell.exit().remove();
    heatMapCell.enter()
        .append('svg:rect')
        .attr('class', 'heatMapCell');
    
    heatMapCell
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return (yScaleHeatMap(d.key)); })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("stroke", '#FFF')
        .style("fill", function(d){ return zscaleHeatMap(getChoiceValue(d)); });

    heatMapCell
        .on("mouseover", function(d){
            tooltip_div       
                .style("visibility", "visible")
                .transition().duration(150)
                .style("opacity", 1);
                var putImageInTooltip = function() {
                    tooltip_div.html(tooltipStringHeat(d));    
                }
                putImageInTooltip();
        })
        .on("mouseout",function(){
            tooltip_div.transition()      
                .duration(200)
                .style("opacity", 0);
        });


    var legendWidth = 2 * cellSize;

    heatMapLegend = heatSvgLegend.selectAll('.heatLegendElement').data([0].concat(zscaleHeatMap.quantiles()), function(d) { return d; });
    
    heatMapLegend.exit().remove();

    heatMapLegend
        .enter()
            .append('g')
        .attr('class', 'heatLegendElement')
        .each(function(d){
            d3.select(this)
                .append('rect')
                    .attr('class', 'heatLegendRect');
        })
        .each(function(d){
            d3.select(this)
                .append('text')
                    .attr('class', 'heatLegendText');
        });
    
    heatMapLegend.transition();
    
    heatMapLegendRect = heatSvgLegend.selectAll('.heatLegendRect').data([0].concat(zscaleHeatMap.quantiles()), function(d) { return d; });
    
    heatMapLegendText = heatSvgLegend.selectAll('.heatLegendText').data([0].concat(zscaleHeatMap.quantiles()), function(d) { return d; });
    
    heatMapLegendRect.exit().remove();
    heatMapLegendText.exit().remove();
    heatMapLegendRect.transition();
    heatMapLegendText.transition();
    
    heatMapLegendRect
        .attr("x", function(d, i) { return heatMapPadding + legendWidth * i; })
        .attr("y", heatMapHeight + 2.5*cellSize)
        .attr("width", legendWidth)
        .attr("height", cellSize)
        .style("fill", function(d){ return zscaleHeatMap(d); });

    heatMapLegendText
        .text(function(d) { return "≥ " + Math.round(d); })
        .attr("x", function(d, i) { return heatMapPadding + legendWidth * i; })
        .attr("y", heatMapHeight + 4*cellSize);

}


function firstButtonHTML(){
    console.log('firstButton');
    var clicked = (firstClick == 'user') ? userSelected : repoSelected;
    var link = (firstClick == 'user') ? ReverseMapper[userSelected] : 'balanced/' + ReverseMapper[repoSelected];
    link = "\"http://github.com/" + link + "\"";

    return "<ul class='nav createFirstButtons' style='margin-top:5px'><li><button type='button' onclick='firstClicked()' class='btn btn-small'>" + clicked + "</button></li><a href=" + link +" class='btn' target='_blank'>"+"<i class='icon-share'>"+"</i></a></ul>";       
}


function secondButtonHTML(){
    console.log('secondButton');
    var clicked = (secondClick == 'user') ? userSelected : repoSelected;
    var link = 'balanced/' + ReverseMapper[repoSelected] + '/commits?author=' + ReverseMapper[userSelected];
    link = "\"http://github.com/" + link + "\"";    

    return "<ul class='nav createSecondButtons' style='margin-top:5px'><a class='btn btn-small' href=" + link + " target='_blank'>" + clicked + "<i class='icon-share'></i></a>";       
}


function radioUpdateSize(dataInput){
    sizeSelected = dataInput;
    var dataobj = filterData(extentVals);
    render_routine(dataobj);
}

function radioUpdate(dataInput){
    choiceSelected = dataInput;

    var dataobj = filterData(null);
    uniTimeSeries = $.extend(true, [], dataobj.all_timeline_data);
    console.log(dataobj);
    // d3.selectAll('.brush').selectAll('rect').remove();
    render_routine(dataobj);
    renderTimeBrush();   
}


function homeClicked(){
    firstClick = null;
    secondClick = null;
    d3.selectAll('.createSecondButtons').remove();
    d3.selectAll('.createFirstButtons').remove();
    var dataobj = filterData(extentVals);
    render_routine(dataobj);
}


function firstClicked(){
    secondClick = null;
    d3.selectAll('.createSecondButtons').remove();
    var dataobj = filterData(extentVals);
    render_routine(dataobj);
}

// function secondClicked(){
//     secondClick = null;
//     var dataobj = filterData(extentVals);
//     render_routine(dataobj);
// }

function brushed(){
    extentVals = brush.empty() ? xScaleTimeBrush.domain() : brush.extent();
    xScaleTimeLine.domain(extentVals);
    timeSvgXaxis.transition().call(xAxisTimeLine);

    var dataobj = filterData(extentVals);

    // Render
    render_routine(dataobj);
}


function tooltipString(d){
    return "<b class='Mytooltip Mytooltitle'>" + d.key + "</b><div>" + "<table ><tr><td><b>Commits</b></td><td style='text-align: right'>" + format(d.values.count) + "</td></tr>" + "<tr><td><b>Total</b></td><td style='text-align: right'>" + format(d.values.total) + "</td></tr>" + "<tr><td><b>Additions</b></td><td style='text-align: right'>" + format(d.values.additions) + "</td></tr>" + "<tr><td><b>Deletions</b></td><td style='text-align: right'>" + format(d.values.deletions) + "</td></tr></table></div>";
}

function tooltipStringHeat(d){
    
    return "<b class='Mytooltip Mytooltitle'>" + d.key + "</b><div>"+ "<table >"+ "<tr><td><b>Date</b></td><td style='text-align: right'>" + d.time + "</td></tr>" + "<tr><td><b>Commits</b></td><td style='text-align: right'>" + format(d.count) + "</td></tr>" + "<tr><td><b>Total</b></td><td style='text-align: right'>" + format(d.total) + "</td></tr>" + "<tr><td><b>Additions</b></td><td style='text-align: right'>" + format(d.additions) + "</td></tr>" + "<tr><td><b>Deletions</b></td><td style='text-align: right'>" + format(d.deletions) + "</td></tr></table></div>";
}

function compareDates(a,b) {
            var a_date = new Date(Date.parse(a));
            var b_date = new Date(Date.parse(b));
            return a_date - b_date;
}


function rollLeaves(leaves) { 
    return {"count": leaves.length, 
            "total": d3.sum(leaves, function(d) {return parseFloat(d.total);}), 
            "additions": d3.sum(leaves, function(d) {return parseFloat(d.additions);}), 
            "deletions": d3.sum(leaves, function(d) {return parseFloat(d.deletions);})}
}


function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}


function timeStampDiff(dateArray){
    var diffInMilliseconds = dateArray[1].getTime() - dateArray[0].getTime();
    // days
    return Math.ceil(diffInMilliseconds / 1000 / 60 / 60 / 24);
}

function determineScale(timestamp) {
    //var startDate = moment(startDate);
    //var endDate = moment(endDate);
    //console.log(numOfDays);

    if(numOfDays < cellLimit) {
        //console.log(timestamp);
        return timestamp;
    }
    else if(numOfDays/7 < cellLimit) {
        timestamp = new Date(timestamp);
        //console.log(d3.time.day.offset(timestamp, (-1)*timestamp.getDay()));
        return d3.time.day.offset(timestamp, (-1) * timestamp.getDay()).toISOString().substring(0,10);
    }
    else {
        return timestamp.substring(0,7) + "-01";
    }
}

function fillMissingData(data, padding, cellSize) {
     //console.log(numOfDays);
     if(numOfDays < cellLimit){
         return fillDaysWeeks(data, padding, cellSize, true);
     } else if(numOfDays/7 < cellLimit) {
         return fillDaysWeeks(data, padding, cellSize, false);
     } else {
        return fillMonths(data, padding, cellSize);
     }
}

function fillDaysWeeks(inputData, padding, cellSize, daily) {

    var startDate = null;
    var totalSteps;
    if(daily) {
        startDate = extentOfDays[0];
        totalSteps = numOfDays;
        size = 1;
        console.log("Daily : " + startDate);
    }else{
        var tmpDate = new Date(extentOfDays[0]);
        startDate = d3.time.day.offset(tmpDate, (-1) * tmpDate.getDay()).toISOString().substring(0,10)
        totalSteps = Math.ceil(numOfDays/7);
        size = 7;
        console.log("Weekly: " + startDate);
    }

    var svgHeight = inputData.length*cellSize + padding*2;
    var svgWidth = totalSteps*cellSize + padding*2;

    var data = new Array();
    var xcount = totalSteps;
    var ycount = inputData.length;
    var svgHeatMapItemWidth = (svgWidth - padding*2) / xcount;
    var svgHeatMapItemHeight = (svgHeight - padding*2) / ycount;
    var startX = padding;
    var startY = (svgHeight-padding) / 2;
    var stepX = svgHeatMapItemWidth;
    var stepY = svgHeatMapItemHeight;
    var xpos = startX;
    var ypos = startY;
    var newValue = 0;
    var k = 0;

    for (var i = 0; i < ycount; i++)
    {
        data.push(new Array());
        var currDate = startDate;
        k = 0;
        for (var j = 0; j < xcount; j++)
        {
            if(k < inputData[i].values.length && inputData[i].values[k].key == currDate) {
                data[i].push({ 
                    time: inputData[i].values[k].key,
                    key: inputData[i].key, 
                    count: inputData[i].values[k].values.count,
                    total: inputData[i].values[k].values.total,
                    additions: inputData[i].values[k].values.additions,
                    deletions: inputData[i].values[k].values.deletions,
                    width: svgHeatMapItemWidth,
                    height: svgHeatMapItemHeight,
                    x: xpos,
                    y: ypos,
                });
                k++;
            } 
            else {
                data[i].push({ 
                    time: currDate,
                    key: inputData[i].key, 
                    count: 0,
                    additions: 0,
                    deletions: 0,
                    total: 0,
                    width: svgHeatMapItemWidth,
                    height: svgHeatMapItemHeight,
                    x: xpos,
                    y: ypos,
                });
            }
            if(daily && i==0 && j % 4 == 0) {
                xAxisData.push(moment(currDate).format('DD-MMM'));
            }

            else if(!daily && i==0 && j % 4 == 0) {
                xAxisData.push("Week " + moment(currDate).weeks());
            }
            currDate = d3.time.day.offset(new Date(currDate), size).toISOString().substring(0,10);
            xpos += stepX;
        }
        xpos = startX;
        ypos += stepY;
    }

    //console.log(data);
    return data;
}


function fillMonths(inputData, padding, cellSize) {
    //console.log(inputData);

    var totalSteps = moment(extentOfDays[1].substring(0,7)).diff(extentOfDays[0].substring(0,7),'months') + 1;
    
    var svgHeight = inputData.length*cellSize + padding*2;
    var svgWidth = totalSteps*cellSize + padding*2;

    var data = new Array();
    var xcount = totalSteps;
    var ycount = inputData.length;
    var svgHeatMapItemWidth = (svgWidth - padding*2) / xcount;
    var svgHeatMapItemHeight = (svgHeight - padding*2) / ycount;
    var startX = padding;
    var startY = (svgHeight-padding) / 2;
    var stepX = svgHeatMapItemWidth;
    var stepY = svgHeatMapItemHeight;
    var xpos = startX;
    var ypos = startY;
    var newValue = 0;
    var k = 0;
    
    for (var i = 0; i < ycount; i++)
    {
        data.push(new Array());
        var currDate = extentOfDays[0].substring(0,7) + "-01";
        k=0;
        for (var j = 0; j < xcount; j++)
        {
            if(k < inputData[i].values.length && inputData[i].values[k].key == currDate) {
                data[i].push({ 
                    time: inputData[i].values[k].key,
                    key: inputData[i].key, 
                    count: inputData[i].values[k].values.count,
                    total: inputData[i].values[k].values.total,
                    additions: inputData[i].values[k].values.additions,
                    deletions: inputData[i].values[k].values.deletions,
                    width: svgHeatMapItemWidth,
                    height: svgHeatMapItemHeight,
                    x: xpos,
                    y: ypos,
                });
                k++;
            } 
            else {
                data[i].push({ 
                    time: currDate,
                    key: inputData[i].key, 
                    count: 0,
                    additions: 0,
                    deletions: 0,
                    total: 0,
                    width: svgHeatMapItemWidth,
                    height: svgHeatMapItemHeight,
                    x: xpos,
                    y: ypos,
                });
            }
            if(i==0 && j % 4 == 0) {
                xAxisData.push(moment(currDate).format("MMM-YY"));//.substring(0,7));
            }
            currDate = moment(currDate).add('months',1).toISOString().substring(0,10);
            xpos += stepX;
        }
        xpos = startX;
        ypos += stepY;
    }

    //console.log(data);
    return data;
}

// Done
