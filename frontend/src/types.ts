export type Role = 'guest' | 'student' | 'teacher' | 'admin';
export interface User { id:string; name:string; email:string; role:Exclude<Role,'guest'> }
export interface Category { id:string; name:string }
export interface Course { id:string; title:string; description:string }
export interface Material { id:string; title:string; description:string; content?:string; file_path?:string|null; external_url?:string|null; access_level:string; created_at:string; author_name:string; category_name?:string|null; category_id?:string|null; course_title?:string|null; course_id?:string|null; rating:number|string; rating_count?:number; comment_count?:number }
export interface Comment { id:string; body:string; author_name:string; created_at:string }
export interface Version { id:string; version_number:number; change_note:string; file_path?:string|null; created_at:string }
export interface MaterialDetail extends Material { versions:Version[]; comments:Comment[] }
