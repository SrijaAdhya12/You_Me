'use client'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useState } from 'react'

export const CreateMeeting = () => {
	const [descriptionInput, setDescriptionInput] = useState('')
	const [startTimeInput, setStartTimeInput] = useState('')
	const [participantInput, setParticipantInput] = useState('')
	const [call, setCall] = useState<Call | null>(null)
	const client = useStreamVideoClient()
	const { user } = useUser()
	const createMeeting = async () => {
		if (!client || !user) return
		try {
			const id = crypto.randomUUID()
			const call = client.call('default', id)
			await call.getOrCreate({
				data: {
					custom: {
						description: descriptionInput
					}
				}
			})
			setCall(call)
		} catch (error) {
			console.error(error)
			alert('Something went wrong.Please try again.')
		}
	}
	if (!client || !user) {
		return <Loader2 className="mx-auto animate-spin" />
	}
	return (
		<div className="flex h-screen flex-col items-center space-y-6">
			<h1 className="text-center text-2xl font-bold">Welcome {user?.username}</h1>
			<div className="mx-auto w-80 space-y-6 rounded-md bg-slate-100 p-5">
				<h2 className="text-xl font-medium">Create a new Meeting</h2>
				<DescriptionInput value={descriptionInput} onChange={setDescriptionInput} />
				<StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
				<ParticipantInput value={participantInput} onChange={setParticipantInput} />
				<button onClick={createMeeting} className="w-full rounded-md bg-blue-500 p-2 text-white">
					Create Meeting
				</button>
			</div>
		</div>
	)
}

interface DescriptionInputProps {
	value: string
	onChange: (value: string) => void
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
	const [active, setActive] = useState(false)
	return (
		<div className="space-y-2">
			<div className="font-medium">Meeting info:</div>
			<label className="flex items-center gap-1.5">
				<input
					type="checkbox"
					checked={active}
					onChange={(e) => setActive(e.target.checked)}
					className="h-4 w-4"
				/>
				Add description
			</label>
			{active && (
				<label className="block space-y-1">
					<span className="font-medium">Description</span>
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						maxLength={500}
						className="w-full rounded-md border border-slate-300 p-2"
					/>
				</label>
			)}
		</div>
	)
}

interface StartTimeInputProps {
	value: string
	onChange: (value: string) => void
}

const StartTimeInput = ({ value, onChange }: StartTimeInputProps) => {
	const [active, setActive] = useState(false)
	const dateTimeLocalNow = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
		.toISOString()
		.slice(0, 16)
	return (
		<div className="space-y-2">
			<div className="font-medium">Meeting start:</div>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={!active}
					onChange={() => {
						setActive(false)
						onChange('')
					}}
				/>
				Start meeting immediately
			</label>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={active}
					onChange={() => {
						setActive(true)
						onChange(dateTimeLocalNow)
					}}
				/>
				Start meeting at date/time
			</label>
			{active && (
				<label className="block space-y-1">
					<span className="font-medium">Start time</span>
					<input
						type="datetime-local"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						min={dateTimeLocalNow}
						className="w-full rounded-md border border-slate-300 p-2"
					/>
				</label>
			)}
		</div>
	)
}

interface ParticipantInput {
	value: string
	onChange: (value: string) => void
}

const ParticipantInput = ({ value, onChange }: ParticipantInput) => {
	const [active, setActive] = useState(false)
	return (
		<div className="space-y-2">
			<div className="font-medium">Participant:</div>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={!active}
					onChange={() => {
						setActive(false)
						onChange('')
					}}
				/>
				Everyone with link can join
			</label>
			<label className="flex items-center gap-1.5">
				<input
					type="radio"
					checked={active}
					onChange={() => {
						setActive(true)
					}}
				/>
				Private Meeting
			</label>
			{active && (
				<label className="block space-y-1">
					<span className="font-medium">Participant Email</span>
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder="Enter email addresses separated by commas"
						className="w-full rounded-md border border-slate-300 p-2"
					/>
				</label>
			)}
		</div>
	)
}
