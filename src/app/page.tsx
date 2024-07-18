'use client'

import { Col, Row } from 'antd'

export default function Home() {
	return (
		<main className="h-full p-8">
			<Row gutter={[32, 32]}>
				<Col span={16}>
					<div className="min-w-full h-[400px] bg-gray-300" />

					<div className="p-4" />

					<div className="min-w-full h-[400px] bg-gray-300" />
				</Col>
				<Col span={8}>
					<div className="min-w-full h-full bg-gray-300" />
				</Col>

				<Col span={24}>
					<div className="min-w-full h-[120px] bg-gray-300" />
				</Col>
			</Row>
		</main>
	)
}
