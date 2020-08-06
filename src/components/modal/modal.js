import React, { Component } from 'react';
import './modal.css';
import Backdrop from './backdrop/backdrop';
import axios from 'axios';

class Modal extends Component{

    constructor(props) {
        super(props)
    
        this.state = {
             modalFlag : false ,
             no_of_shares : 0 ,
             buy_price :0 ,
             date : '',
             inputFlag :true 
        }

        this.closeModal = this.closeModal.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.addStock = this.addStock.bind(this);
    }
    closeModal = () =>{
          this.props.closeModal(false);
    }
    addStock = () =>{
       
        // to handle empty input fields 
        if(document.getElementById("noShares").value==='' || document.getElementById("buyPrice").value===''
            || document.getElementById("buyDate").value===''){
            document.getElementById("errorMsg").innerHTML="<strong>Please fill all the fields</strong>";
        
        }
        else{
  
            let profitLoss = (this.props.currentPrice-this.state.buy_price)*this.state.no_of_shares;
            axios.post('https://burger-app-8f654.firebaseio.com/addStock.json',{
                symbol: this.props.stockSymbol,
                name: this.props.stockName ,
                share: this.state.no_of_shares ,
                buyprice: this.state.buy_price,
                date: this.state.date,
                currentPrice : this.props.currentPrice,
                profitLoss : profitLoss
            })
            
            console.log(this.props.stockKey);
            axios.delete(`https://burger-app-8f654.firebaseio.com/companyStock/${this.props.stockKey}.json`);

            
            let data={ 
                shareCount : this.state.no_of_shares,
                buy_price :this.state.buy_price ,
                stockName : this.props.stockName ,
                stockSymbol :this.props.stockSymbol ,
                currentPrice : this.props.currentPrice ,
                profitLoss : profitLoss
            }  
                    
            this.props.addStock(false,this.state.no_of_shares,this.state.buy_price,data);
        }   
    }
    // to set state according to input
    handleInput = (event)=>{
       let val = event.target.value;
      
       if(event.target.name==='no_of_shares'){
            this.setState({
                no_of_shares : val
            })
       }
       else if(event.target.name==='buy-price'){
        this.setState({
            buy_price : val
        })
       }
       else{
           this.setState({
               date:val
           })
       }
       
       
    }
    render(){
       
        return(
            <div>
                <Backdrop></Backdrop>
                <div style={{height: '500px', textAlign: 'center', position: 'fixed', 
                        backgroundColor: '#fff', zIndex: '500', left: '15%', top: '10%', 
                        boxSizing: 'border-box', width: '70%', borderRadius:'10px'}}>
                        <h2>Add {this.props.stockName} to My Stocks</h2>  <br/><br/>  
                        <form>
                            <label htmlFor='name'> <strong>Company Name</strong></label> : <strong>{this.props.stockName}</strong><br/><br/>
                            
                            <label htmlFor="name"><strong>No. of Shares</strong></label> : <input id='noShares' type='number' placeholder='No. of Shares'
                                    name='no_of_shares'   onChange={this.handleInput}></input>
                                <br/><br/>
                            <label htmlFor="name"><strong>Buy Price</strong></label> : <input type="number" id='buyPrice' placeholder='Buying Price'
                                    name='buy-price'    onChange={this.handleInput}></input>
                                <br/><br/>
                            <label htmlFor="name"><strong>Buy Date</strong></label> : <input type='Date' id='buyDate' name='date'
                                    onChange={this.handleInput}></input>
                            <br/><br/>
                            
                        </form>
                       
                        <button type='button' className='AddButton' style={{backgroundColor:"yellow",height:"10px",textAlign:"center",paddingTop:"2px"}} id='addForm' onClick={this.addStock}>Add</button>
                       <button type="button" className='closeButton' style={{backgroundColor:"red",height:"10px",textAlign:"center",paddingTop:"2px",color:"white"}} id="closeBtn" onClick={this.closeModal}>Close</button><br/><br/>
                       <div id="errorMsg"></div>
                 </div>
            </div>
        )
    }
}



export default Modal;