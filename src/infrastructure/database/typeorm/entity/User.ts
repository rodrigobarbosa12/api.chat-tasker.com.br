import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export type AccessOverrideType = 'free' | 'promo' | 'beta' | null

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 120 })
  name: string

  @Column({ length: 150 })
  email: string

  @Column({ length: 200 })
  password: string

  @Column({
    type: 'enum',
    enum: ['admin', 'default'],
    default: 'default',
  })
  accessRole?: 'admin' | 'default'

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
