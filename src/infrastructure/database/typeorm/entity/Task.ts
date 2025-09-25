import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  user: User

  @Column()
  userId: number

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  description: string

  @Column()
  originalText: string

  @Column({ default: 'open' })
  status: string

  @Column({ nullable: true })
  priority: string

  @Column({ type: 'float', nullable: true })
  priorityScore: number

  @Column({ nullable: true })
  priorityExplain: string

  @Column('simple-json', { nullable: true })
  embedding: number[]

  @Column()
  createdBy: number

  @Column()
  updatedBy: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
