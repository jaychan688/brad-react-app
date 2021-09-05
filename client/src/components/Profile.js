import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from 'axios'

import StateContext from '../StateContext'
import ProfilePosts from './ProfilePosts'
import Page from './Page'

const Profile = () => {
	const { username } = useParams()
	const appState = useContext(StateContext)
	// Set the initail fake profileData, for first render,
	//  after call useEffect(), update profileData, re-render componet and show
	// correct profileData
	const [profileData, setProfileData] = useState({
		profileUsername: '...',
		profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
		isFollowing: false,
		counts: { postCount: '', followerCount: '', followingCount: '' },
	})

	// Run fetchData the very first time the Profile component is rendered
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		const fetchData = async () => {
			try {
				const response = await Axios.post(
					`/profile/${username}`,
					{ token: appState.user.token },
					{ cancelToken: ourRequest.token }
				)
				setProfileData(response.data)
			} catch (e) {
				console.log('There was a problem.', e)
			}
		}
		fetchData()
		// Every time perform async action within useEffect,
		// need to return a cleanup function
		return () => {
			// This function will run when the componet is unmount or stop being render
			// In this case, we just want to cancel axios request
			ourRequest.cancel()
		}
	}, [])

	return (
		<Page title="Profile Screen">
			<h2>
				<img className="avatar-small" src={profileData.profileAvatar} />{' '}
				{profileData.profileUsername}
				<button className="btn btn-primary btn-sm ml-2">
					Follow <i className="fas fa-user-plus"></i>
				</button>
			</h2>

			<div className="profile-nav nav nav-tabs pt-2 mb-4">
				<a href="#" className="active nav-item nav-link">
					Posts: {profileData.counts.postCount}
				</a>
				<a href="#" className="nav-item nav-link">
					Followers: {profileData.counts.followerCount}
				</a>
				<a href="#" className="nav-item nav-link">
					Following: {profileData.counts.followingCount}
				</a>
			</div>

			<ProfilePosts />
		</Page>
	)
}

export default Profile
