const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export function token(){return localStorage.getItem('sv_token')||''}
export async function api<T>(path:string, init:RequestInit={}):Promise<T>{
 const headers = new Headers(init.headers); if(!(init.body instanceof FormData)&&!headers.has('Content-Type'))headers.set('Content-Type','application/json'); if(token())headers.set('Authorization',`Bearer ${token()}`);
 const response=await fetch(`${API}${path}`,{...init,headers}); if(response.status===204)return undefined as T;
 const data=await response.json().catch(()=>({message:'Сервер вернул некорректный ответ'})); if(!response.ok)throw new Error(data.message||`Ошибка ${response.status}`);return data as T;
}
export function fileUrl(path?:string|null){return path?`${API.replace(/\/api$/,'')}${path}`:''}
