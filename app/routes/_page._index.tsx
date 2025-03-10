import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { deleteTryout, getTryouts } from "~/hooks/tryouts";
import { useLoaderData } from "@remix-run/react";
import { Tryout, User } from "~/auth/interface";
import { useEffect, useState } from "react";
import { Modal, ModalCenter, ModalContent } from "~/components/elements/Modals";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Filter, ChevronDown, X, Search } from "lucide-react";
import { Input } from "~/components/ui/input";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);
  const formData = await request.formData();
  const tryoutId = formData.get("tryoutId") as string;

  try {
    const response = await deleteTryout(t, tryoutId);

    if (!response) {
      return Response.json({
        success: false,
        message: "Failed to delete tryout",
      });
    }

    return redirect("/");
  } catch (error) {
    console.error("Error deleting tryout:", error);
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

export async function loader(args: LoaderFunctionArgs) {
  const cookieHeader = args.request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const user = await getUserData(t);

  if (!user) {
    return redirect("/login");
  }

  const tryouts = await getTryouts(t);

  return {
    user,
    tryouts,
    t,
  };
}

export default function Index() {
  const data = useLoaderData<{ tryouts: Tryout[]; user: User }>();
  const { tryouts } = data;
  const { user } = data;
  const navigation = useNavigation();
  const actionData = useActionData<{ success: boolean; message: string }>();
  const submit = useSubmit();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTryout, setSelectedTryout] = useState<Tryout | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    ...new Set(tryouts.map((tryout) => tryout.category)),
  ].sort();

  const filteredTryouts = tryouts.filter((tryout) => {
    const matchesCategory = selectedCategory
      ? tryout.category === selectedCategory
      : true;

    const matchesSearch = searchQuery
      ? tryout.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  const handleDeleteClick = (tryout: Tryout) => {
    setSelectedTryout(tryout);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTryout) return;

    const formData = new FormData();
    formData.append("tryoutId", selectedTryout.id);

    submit(formData, { method: "post" });
    setDeleteDialogOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col gap-2 justify-start items-center w-full h-fit min-h-screen py-10">
      <h1 className="text-4xl font-bold">Tryouts!</h1>
      <div className="w-[80%] flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[100%]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-cyan-900"
              >
                <Filter className="h-4 w-4" />
                {selectedCategory
                  ? `Category: ${selectedCategory}`
                  : "Filter by Category"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                checked={selectedCategory === null}
                onCheckedChange={() => setSelectedCategory(null)}
              >
                All Categories
              </DropdownMenuCheckboxItem>

              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategory === category}
                  onCheckedChange={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link to="/tryout/form">
          <Button variant="default">Create Tryout</Button>
        </Link>
      </div>

      {selectedCategory && (
        <div className="w-[80%] flex justify-start my-2">
          <div className="bg-primary/10 text-white flex items-center gap-2 px-3 py-1 rounded-full text-sm">
            <span>Category: {selectedCategory}</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="hover:bg-primary/20 rounded-full p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <div className="w-[80%] text-sm text-white ml-8">
        Showing {filteredTryouts.length}{" "}
        {filteredTryouts.length === 1 ? "tryout" : "tryouts"}
        {selectedCategory ? ` in ${selectedCategory}` : ""}
      </div>

      {filteredTryouts.length === 0 && (
        <Card className="w-[80%] py-8">
          <CardDescription className="text-center">
            No tryouts found{" "}
            {selectedCategory ? `in category "${selectedCategory}"` : ""}.
          </CardDescription>
        </Card>
      )}

      {filteredTryouts.map((tryout, index) => (
        <Card key={index} className="w-[80%]">
          <CardTitle className="flex flex-row justify-between p-6 pb-2">
            <div className="flex flex-col">
              <span>{tryout.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                Category: {tryout.category}
              </span>
            </div>
            <Link to={`/tryout/view/${tryout.id}`}>
              <Button variant="default">Take the test</Button>
            </Link>
          </CardTitle>
          <CardDescription className="space-y-1 p-6 pt-0">
            <p>
              Opened:{" "}
              {new Date(tryout.startAt).toLocaleString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <p>
              Closed:{" "}
              {new Date(tryout.endAt).toLocaleString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            {tryout.userId === user.id && (
              <div className="flex flex-row justify-start gap-4 pt-2">
                <Link to={`/tryout/edit/${tryout.id}`}>
                  <Button variant="default">Edit</Button>
                </Link>
                <Button
                  variant="default"
                  className="bg-red-900 hover:bg-red-800"
                  onClick={() => handleDeleteClick(tryout)}
                  disabled={navigation.state === "submitting"}
                >
                  Delete
                </Button>
              </div>
            )}
          </CardDescription>
        </Card>
      ))}

      <Modal open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <ModalCenter closeButton={false} className="max-md:min-w-[70vw]">
          <ModalContent className="text-center space-y-5 flex flex-col items-center">
            <h1 className="text-3xl text-center text-cyan-950 font-semibold">
              Confirm Deletion
            </h1>
            <p className="text-gray-600">
              Are you sure you want to delete "{selectedTryout?.title}"? This
              action cannot be undone.
            </p>
            <div className="flex flex-row gap-4 justify-between w-full">
              <Button
                className="w-full bg-slate-600 hover:bg-slate-500"
                onClick={() => {
                  setDeleteDialogOpen(false);
                }}
                variant={"default"}
              >
                Cancel
              </Button>
              <Button
                className="w-full bg-red-900 hover:bg-red-800"
                onClick={handleConfirmDelete}
                variant={"default"}
                disabled={navigation.state === "submitting"}
              >
                {navigation.state === "submitting" ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </ModalContent>
        </ModalCenter>
      </Modal>
    </div>
  );
}
