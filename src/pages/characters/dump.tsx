import { trpc } from '../../utils/trpc'

const dump = () => {
  const { data } = trpc.useQuery(['character.get-all'])

  if (!data) return <></>

  return <div>{JSON.stringify(data, null, 2)}</div>
}
export default dump
