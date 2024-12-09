import React, { Component } from 'react';
import { createComment } from '../api/apiProduct';
import { showError, showSuccess, alertRemove } from '../utils/messages';
import { userInfo } from '../utils/auth';


class CommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: this.props.id,
            commentBody: '',
            commentRating: '',
            success: false,
            error: false,
            msg: ""
        }
        
    }

    handleInputChange = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        console.log("state ", this.state)
        const { product, commentBody, commentRating } = this.state
        const { token } = userInfo()
        createComment(token, product, commentBody, commentRating)
            .then((res) => {
                this.setState({
                    ...this.state,
                    commentBody: '',
                    commentRating: '',
                    success: true,
                    msg: res.data.message 
                })
                this.props.callback()
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    commentBody: '',
                    commentRating: '',
                    msg: '',
                    error: true,
                    success: true
                })
            })
    }

    render() {
        return (
            <div>
                {showSuccess(this.state.success, this.state.msg)}
                {showError(this.state.error, "Something Wrong!")}
                {alertRemove()}
                <h4 style={{color: "gray"}}>Submit Comments</h4>
                <hr />
                <form onSubmit={(e) => this.handleSubmit(e)}>
                <div className="form-group">
                <input className='form-control'
                        name='commentBody'
                        value={this.state.commentBody}
                        type='textarea'
                        placeholder='write comment...'
                        required
                        onChange={(e) => this.handleInputChange(e)}
                    />
                </div>

                    <div className='form-group'>

                        <select className='form-control'
                        name='commentRating'
                        value={this.state.commentRating}
                        onChange={e => this.handleInputChange(e)}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                 
                    </div>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                </form>
            </div>
        )
    }
}

export default CommentForm;