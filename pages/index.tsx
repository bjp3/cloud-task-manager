import { Inter } from 'next/font/google'
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Form, Input, message, Modal, Select, Space, Table, DatePicker } from "antd";
import dayjs from "dayjs";

const inter = Inter({ subsets: ['latin'] })

type Task = {
	id: number;
	title: string;
	description?: string;
	priority: string;
	status: string;
	sprint?: string;
	dueDate?: string;
	createdAt?: string;
};

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

const tailLayout = {
	wrapperCol: { offset: 8, span: 12 },
};

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null
		};

		setIsModalOpen(false);

		fetch('/api/create_task', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then(async response => {
			if (response.status === 200) {
				const task = await response.json();
				message.success('Created task ' + task.title);
				setTasks([...tasks, task]);
				form.resetFields();
			} else {
				message.error(`Failed to create task`);
			}
		}).catch(res => { message.error(res.toString()) })
	};

	const onDelete = async (task: Task) => {
		const { id } = task;

		fetch('/api/delete_task', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		}).then(async response => {
			if (response.status === 200) {
				message.success('Deleted task ' + task.title);
				setTasks(tasks.filter(t => t.id !== id));
			} else {
				message.error(`Failed to delete task`);
			}
		}).catch(res => { message.error(res.toString()) })
	};

	const columns: ColumnsType<Task> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Priority',
			dataIndex: 'priority',
			key: 'priority',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: 'Sprint',
			dataIndex: 'sprint',
			key: 'sprint',
		},
		{
			title: 'Due Date',
			dataIndex: 'dueDate',
			key: 'dueDate',
			render: (text) => text ? dayjs(text).format("YYYY-MM-DD") : '',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<a onClick={() => onDelete(record)}>Delete</a>
				</Space>
			),
		},
	];

	const onReset = () => {
		form.resetFields();
	};

	const showModal = () => {
		setIsModalOpen(true);
		form.resetFields();
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
	};

	useEffect(() => {
		fetch('/api/all_task', { method: "GET" })
			.then(res => res.json())
			.then(json => setTasks(json));
	}, []);

	return <>
		<Button type="primary" onClick={showModal}>
			Add Task
		</Button>

		<Modal
			title="Add Task"
			onCancel={handleCancel}
			open={isModalOpen}
			footer={null}
			width={800}
		>
			<Form
				{...layout}
				form={form}
				name="task-form"
				onFinish={onFinish}
				style={{ maxWidth: 600 }}
			>
				<Form.Item name="title" label="Title" rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item name="description" label="Description">
					<Input />
				</Form.Item>

				<Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
					<Select
						options={[
							{ value: 'Low', label: 'Low' },
							{ value: 'Medium', label: 'Medium' },
							{ value: 'High', label: 'High' },
						]}
					/>
				</Form.Item>

				<Form.Item name="status" label="Status" rules={[{ required: true }]}>
					<Select
						options={[
							{ value: 'To Do', label: 'To Do' },
							{ value: 'In Progress', label: 'In Progress' },
							{ value: 'Done', label: 'Done' },
						]}
					/>
				</Form.Item>

				<Form.Item name="sprint" label="Sprint">
					<Input />
				</Form.Item>

				<Form.Item name="dueDate" label="Due Date">
					<DatePicker />
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
					<Button htmlType="button" onClick={onReset}>
						Reset
					</Button>
					<Button htmlType="button" onClick={handleCancel}>
						Cancel
					</Button>
				</Form.Item>
			</Form>
		</Modal>

		<Table columns={columns} dataSource={tasks} rowKey="id" />
	</>;
}
