import React, { Component } from "react";
import "./stocks-table.css";
import axios from "axios";
class MyStocksTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: false,
      tableData: [],
      isCLicked: false
    };
  }
  componentDidMount() {
    this.setTableContents();
  }
  componentDidUpdate() {
    this.setTableContents();
  }

  // to set contents for the table
  setTableContents = () => {
    axios
      .get("https://burger-app-8f654.firebaseio.com/addStock.json")
      .then(res => {
      
        this.setState({
          tableData: res.data
        });
      })
      .catch(err => console.log("error:" + err));

   
  };

  stopTracking = event => {
    event.preventDefault();
    const id = event.target.value;
    axios
      .delete(`https://burger-app-8f654.firebaseio.com/addStock/${id}.json`)
      .catch(err => {
        console.log(err);
        alert("Network issue check  console for error.");
      });

    axios.post(`https://burger-app-8f654.firebaseio.com/companyStock.json`, {
      name: this.state.tableData[id].name,
      symbol: this.state.tableData[id].symbol
    });
  };
  render() {
  
    let showContent;
    const isSelected = this.props.isSelected;
    if (this.state.tableData !== null) {
      const tableData = Object.entries(this.state.tableData);
     
      if (isSelected || tableData.length > 0) {
        showContent = tableData.map(item => {
          return (
            <tr key={item[1].symbol}>
              <td>{item[1].symbol}</td>
              <td>{item[1].name}</td>
              <td>{item[1].share}</td>
              <td>{item[1].buyprice}</td>
              <td>{item[1].currentPrice}</td>
              <td>{item[1].profitLoss}</td>
              <td>
                <button
                  type="button"
                  className="StopTrackingBtn"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    height: "10px",
                    textAlign: "center",
                    paddingTop: "2px"
                  }}
                  id="stopTrack"
                  value={item[0]}
                  onClick={this.stopTracking}
                >
                  Stop Tracking
                </button>
              </td>
            </tr>
          );
        });
      }
    } else {
      showContent = (
        <tr className="text-center">
          <td colSpan="7">
            <strong>No Stocks have been selected</strong>
          </td>
        </tr>
      );
    }

    return <tbody>{showContent}</tbody>;
  }
}

export default MyStocksTable;
