import { Button } from './ui/button';
import { Badge } from './ui/badge';
import JobInfo from './JobInfo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJobAction } from '@/utils/actions';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

function DeleteJobBtn({ id }: { id: string }) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: (id: string) => deleteJobAction(id),
		onSuccess: (data) => {
			if (!data) {
				toast({
					description: 'There was an error removing the job'
				});
				return;
			}
			queryClient.invalidateQueries({ queryKey: ['jobs'] });
			queryClient.invalidateQueries({ queryKey: ['stats'] });
			queryClient.invalidateQueries({ queryKey: ['charts'] });

			toast({ description: 'Job has been removed' });
		}
	});

	return (
		<Button
			size='sm'
			disabled={isPending}
			onClick={() => {
				mutate(id);
			}}>
			<Trash2 />
			{isPending ? 'Deleting Job...' : 'Delete'}
		</Button>
	);
}
export default DeleteJobBtn;
