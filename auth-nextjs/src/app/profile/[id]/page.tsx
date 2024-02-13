//to grab params parent folder should be named using square brackets[]
export default function UserProfile({params}: any){
    return (<div>
       <h1>{params.id}</h1>
    </div>)
}
