import React, { Component } from "react";
import axios from "axios";
import "./stock-button.css";

class StockButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: null,
      apiKey: "B2GITEYVXUDSZU15",
      count: 0
    };
    this.selectStock = this.selectStock.bind(this);
  }

  componentDidMount() {
    console.log("inside component did mount");
    this.getStockButtonNames();
  }

  componentDidUpdate() {
    this.getStockButtonNames();
  }

  getStockButtonNames = () => {
    var count = 0;
    // fetch stock names from firebase database
    axios
      .get("https://burger-app-8f654.firebaseio.com/companyStock.json")
      .then(res => {
        if (res.data !== null) {
          count = Object.keys(res.data).length;
        }
        this.setState({
          stock: res.data,
          currentPrice: 0,
          count: count
        });
        //  console.log(this.state.stock);
      });
  };

  selectStock = event => {
    event.preventDefault();
    let val = event.target.value; //symbol is collected here
    let id = event.target.id;
    let stockName = event.target.name; //stockname is taken here

    axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${val}&apikey=${this.state.apiKey}`
      )
      .then(res => {
        let dailyData = res.data["Time Series (Daily)"];
        let latestData = Object.values(dailyData)[0];
        this.setState({
          currentPrice: latestData["4. close"]
        });
        this.props.currentPrice(
          val,
          stockName,
          this.state.currentPrice,
          true,
          id
        );
      })
      .catch(error => console.log(error));
  };

  render() {
    let showStock = null;
    let showMessage = null;
    if (this.state.stock !== null) {
      let stockValue = Object.entries(this.state.stock);

      if (this.state.count > 3) {
        showStock = stockValue.map(i => {
          return (
            <li key={i[1].symbol}>
              <button
                type="button"
                id={i[0]}
                name={i[1].name}
                style={{
                  backgroundColor: "#FF00FF",
                  color: "white",
                  height: "30px",
                  textAlign: "center",
                  paddingTop: "2px"
                }}
                className="StockButton"
                onClick={this.selectStock}
                value={i[1].symbol}
              >
                {i[1].symbol}
              </button>
              <span>
                {" "}
                <strong>{i[1].name}</strong>
              </span>
            </li>
          );
        });
      } else {
        showMessage = (
          <h3>
            You have selected 5 stocks, cannot add more <br /> Remove some
            stocks if you want to add a new stock{" "}
          </h3>
        );
      }
    }
    return (
      <div className="container">
        <h3>Add stocks to my stocks</h3>
        <ul className="buttonList">{showStock}</ul>
        <div>{showMessage}</div>
      </div>
    );
  }
}

export default StockButton;
