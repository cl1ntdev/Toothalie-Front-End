class Patient {
  private username: string;
  private first_name: string;
  private last_name: string;
  private password: string;
  private contact_no: string;
  private email: string;

  constructor(
    username: string,
    first_name: string,
    last_name: string,
    password: string,
    contact_no: string,
    email: string
  ) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.password = password;
    this.contact_no = contact_no;
    this.email = email;
  }

  // Getters
  public getPatientId(): number {
    return this.patient_id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getFirstName(): string {
    return this.first_name;
  }

  public getLastName(): string {
    return this.last_name;
  }

  public getRole(): string {
    return this.role;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getContactNo(): string {
    return this.contact_no;
  }

  public getEmail(): string {
    return this.email;
  }

  // Setters
  public setPatientId(patient_id: number): void {
    this.patient_id = patient_id;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public setFirstName(first_name: string): void {
    this.first_name = first_name;
  }

  public setLastName(last_name: string): void {
    this.last_name = last_name;
  }

  public setRole(role: string): void {
    this.role = role;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public setCreatedAt(created_at: Date): void {
    this.created_at = created_at;
  }

  public setContactNo(contact_no: string): void {
    this.contact_no = contact_no;
  }

  public setEmail(email: string): void {
    this.email = email;
  }
}


export default Patient