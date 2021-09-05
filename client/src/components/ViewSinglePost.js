import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link, withRouter } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import ReactTooltip from 'react-tooltip'
import Axios from 'axios'

import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import NotFound from './NotFound'

function ViewSinglePost(props) {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	const { id } = useParams()

	const [isLoading, setIsLoading] = useState(true)
	const [post, setPost] = useState()

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${id}`, {
					cancelToken: ourRequest.token,
				})

				setPost(response.data)
				setIsLoading(false)
			} catch (e) {
				console.log('There was a problem or the request was cancelled.', e)
			}
		}
		fetchPost()
		return () => {
			ourRequest.cancel()
		}
	}, [])

	if (!isLoading && !post) {
		return <NotFound />
	}

	if (isLoading)
		return (
			<Page title="...">
				<LoadingDotsIcon />
			</Page>
		)

	const date = new Date(post.createdDate)
	const dateFormatted = `${
		date.getMonth() + 1
	}/${date.getDate()}/${date.getFullYear()}`

	const isOwner = () => {
		if (appState.loggedIn) {
			return appState.user.username == post.author.username
		}
		return false
	}

	const deleteHandler = async () => {
		const areYouSure = window.confirm('Do you really want to delete this post?')
		if (areYouSure) {
			try {
				const response = await Axios.delete(`/post/${id}`, {
					data: { token: appState.user.token },
				})
				if (response.data == 'Success') {
					// 1. display a flash message
					appDispatch({
						type: 'flashMessage',
						value: 'Post was successfully deleted.',
					})
					// 2. redirect back to the current user's profile
					props.history.push(`/profile/${appState.user.username}`)
				}
			} catch (e) {
				console.log('There was a problem.')
			}
		}
	}

	return (
		<Page title={post.title}>
			<div className="d-flex justify-content-between">
				<h2>{post.title}</h2>
				{isOwner() && (
					<span className="pt-2">
						<Link
							to={`/post/${post._id}/edit`}
							data-tip="Edit"
							data-for="edit"
							className="text-primary mr-2"
						>
							<i className="fas fa-edit"></i>
						</Link>
						<ReactTooltip id="edit" className="custom-tooltip" />{' '}
						<a
							onClick={deleteHandler}
							data-tip="Delete"
							data-for="delete"
							className="delete-post-button text-danger"
						>
							<i className="fas fa-trash"></i>
						</a>
						<ReactTooltip id="delete" className="custom-tooltip" />
					</span>
				)}
			</div>

			<p className="text-muted small mb-4">
				<Link to={`/profile/${post.author.username}`}>
					<img className="avatar-tiny" src={post.author.avatar} />
				</Link>
				Posted by{' '}
				<Link to={`/profile/${post.author.username}`}>
					{post.author.username}
				</Link>{' '}
				on {dateFormatted}
			</p>

			<div className="body-content">
				<ReactMarkdown
					children={post.body}
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeHighlight]}
				/>
			</div>
		</Page>
	)
}

export default withRouter(ViewSinglePost)