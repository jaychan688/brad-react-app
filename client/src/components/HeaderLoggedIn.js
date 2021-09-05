import React, { useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'

import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

const HeaderLoggedIn = ({ history }) => {
	const appDispatch = useContext(DispatchContext)
	const { user } = useContext(StateContext)

	const handleLogout = () => {
		appDispatch({ type: 'logout' })
		history.push('/')
	}

	return (
		<div className="flex-row my-3 my-md-0">
			<a href="#" className="text-white mr-2 header-search-icon">
				<i className="fas fa-search"></i>
			</a>
			<span className="mr-2 header-chat-icon text-white">
				<i className="fas fa-comment"></i>
				<span className="chat-count-badge text-white"> </span>
			</span>
			<Link to={`/profile/${user.username}`} className="mr-2">
				<img className="small-header-avatar" src={user.avatar} />
			</Link>
			<Link className="btn btn-sm btn-success mr-2" to="/create-post">
				Create Post
			</Link>
			<button onClick={handleLogout} className="btn btn-sm btn-secondary">
				Sign Out
			</button>
		</div>
	)
}

export default withRouter(HeaderLoggedIn)
