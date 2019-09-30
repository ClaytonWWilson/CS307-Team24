import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';


class Writing_Microblogs extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            title: '',
            characterCount: 10
            
        };
        

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeforPost = this.handleChangeforPost.bind(this);
    }

    handleChange(event) {
        this.setState( {title: event.target.value });
    }

    handleSubmit(event) {
        alert('A title for the microblog was inputted: ' + this.state.title + '\nA microblog was posted: ' + this.state.value);
        event.preventDefault();
    }

    handleChangeforPost(event) {
        this.setState({value: event.target.value })
    }

    handleChangeforCharacterCount(event) {
        const charCount = event.target.value.length
        const charRemaining = 10 - charCount
        this.setState({characterCount: charRemaining })
    }


    render() {
        return (
            <div>
            <div style={{ width: "200px", height: "50px", marginTop: "180px", marginLeft: "30px" }}>         
             <form>
                    <input type="text" placeholder="Enter Microblog Title" value={this.state.title} onChange={this.handleChange} />
            </form>
             </div>
             
             <div style={{ width: "200px", marginLeft: "50px"}}>        
                <form onSubmit={this.handleSubmit}>
                    <textarea value={this.state.value} required maxLength="10" placeholder= "Write Microblog here..." 
                        onChange = { (e) => { this.handleChangeforPost(e); this.handleChangeforCharacterCount(e) } } cols={40} rows={20} />      
                 <div style={{ fontSize: "14px", marginRight: "-100px"}} >
                    <p2>Characters Left: {this.state.characterCount}</p2>
                 </div>
                 <div style={{ marginRight: "-100px"  }}>        
                    <button onClick>Share Post</button> 
                 </div>
                </form>
             </div>
             </div>
            
        );
    }


}

export default Writing_Microblogs;