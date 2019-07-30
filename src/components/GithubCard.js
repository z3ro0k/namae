import React from 'react'
import useFetch from 'fetch-suspense'
import { Card, CardTitle, AvailabilityCell } from './Card'
import { FaGithub } from 'react-icons/fa'

function Availability({ name }) {
  const response = useFetch(`/availability/github/${name}`)

  if (response.error) {
    throw new Error(`GitHub: ${response.error}`)
  }

  return (
    <AvailabilityCell
      name={name}
      availability={response.availability}
      url={`https://github.com/${name}`}
      prefix="github.com/"
      icon={<FaGithub />}
    />
  )
}

export default function GithubCard({ name }) {
  return (
    <Card key={name}>
      <CardTitle>GitHub</CardTitle>
      <Availability name={name} />
    </Card>
  )
}
