import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";

function useOnboarding() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.response.data.message);
    },
  });
  return { onboardingMutation: mutate, isPending, error };
}

export default useOnboarding;
