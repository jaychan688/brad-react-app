import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import StateContext from '../StateContext'

import LoadingDotsIcon from './LoadingDotsIcon'
import Post from './Post'

const ProfilePosts = () => {
	const appState = useContext(StateContext)
	const { username } = useParams()
	// Render the component the very first time, show the <LoadingDotsIcon />
	// after call useEffect(), update isLoading and posts to show the real data
	const [isLoading, setIsLoading] = useState(true)
	const [posts, setPosts] = useState([])

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()

		const fetchPosts = async () => {
			try {
				const response = await Axios.get(`/profile/${username}/posts`, {
					cancelToken: ourRequest.token,
				})

				setPosts(response.data)
				setIsLoading(false)
			} catch (e) {
				console.log('There was a problem.', e)
			}
		}
		fetchPosts()
		// Every time perform async action within useEffect,
		// need to return a cleanup function
		return () => {
			// This function will run when the componet is unmount or stop being render
			// In this case, we just want to cancel axios request
			ourRequest.cancel()
		}
	}, [username])

	if (isLoading) return <LoadingDotsIcon />

	return (
		<div className="list-group">
			{posts.length > 0 &&
				posts.map(post => {
					return <Post noAuthor={true} post={post} key={post._id} />
				})}
			{posts.length == 0 && appState.user.username == username && (
				<p className="lead text-muted text-center">
					You haven&rsquo;t created any posts yet;{' '}
					<Link to="/create-post">create one now!</Link>
				</p>
			)}
			{posts.length == 0 && appState.user.username != username && (
				<p className="lead text-muted text-center">
					{username} hasn&rsquo;t created any posts yet.
				</p>
			)}
		</div>
	)
}

export default ProfilePosts
