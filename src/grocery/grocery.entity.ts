import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['itemId'])
export class GroceryItem {
  @PrimaryGeneratedColumn('uuid')
  @Unique(['itemId'])
  itemId: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;
}
