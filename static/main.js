document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let query = document.getElementById("query").value;
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: query,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        displayResults(data);
        displayChart(data);
      });
  });

function displayResults(data) {
  let resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h2>Results</h2>";
  for (let i = 0; i < data.documents.length; i++) {
    let docDiv = document.createElement("div");
    docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i]}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
    resultsDiv.appendChild(docDiv);
  }
}

function displayChart(data) {
  // Input: data (object) - contains the following keys:
  //        - documents (list) - list of documents
  //        - indices (list) - list of indices
  //        - similarities (list) - list of similarities
  // TODO: Implement function to display chart here
  //       There is a canvas element in the HTML file with the id 'similarity-chart'
  let similarities = data.similarities;
  let labels = data.indices.map((index) => "Doc " + index);

  let trace = {
    x: labels,
    y: similarities,
    type: "bar",
    marker: {
      color: "rgba(55,128,191,0.7)",
      line: {
        color: "rgba(55,128,191,1.0)",
        width: 2,
      },
    },
  };

  let layout = {
    title: "Cosine Similarity of Top 5 Documents",
    xaxis: {
      title: "Documents",
    },
    yaxis: {
      title: "Similarity Score",
    },
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
    },
  };
  let config = {
    displayModeBar: false,
    responsive: true,
  };

  Plotly.newPlot("similarity-chart", [trace], layout, config);
}
