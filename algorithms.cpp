using namespace std;
#include <iostream>
#include <fstream>
#include <vector>
#include <stack>
#include <queue>
#include <unordered_set>
using int_pair = pair<size_t, size_t>;
using float_pair = pair<double, double>;
//graph
vector<vector<int_pair>> outgoingEdges; // // vertex; distance
vector<vector<int>> matrix; // matrix smezhnosty (-1 : path doesnt exist)
vector<size_t> fixed_objects; // firestations, hospitals, burger kings
vector<size_t> no_fixed_objects; // firestations, hospitals, burger kings
size_t infinty = std::numeric_limits<size_t>::max();
//

vector<size_t> dijkstra(const size_t start)
{
	size_t n = outgoingEdges.size();

	vector<size_t> distance(n, infinty);
	auto f = [](int_pair x, int_pair y)
	{
		return x.second > y.second;
	};
	std::priority_queue<int_pair, vector<int_pair>, decltype(f)> q(f);
	// vertex; distance
	q.push({ start, 0 });

	while (!q.empty())
	{
		auto vertex = q.top();
		q.pop();
		if (distance[vertex.first] < infinty) // vertex already used
			continue;
		distance[vertex.first] = vertex.second;
		for (auto& u : outgoingEdges[vertex.first])
			if (distance[u.first] == infinty)
				q.push({ u.second, vertex.second + u.second });
	}
	//for (int d : distance)
	//	cout << d << " ";
	return distance;
}

vector<int_pair> dijkstra_path(const size_t start)
{
	size_t n = outgoingEdges.size();

	vector<int_pair> distance(n, int_pair(infinty, infinty)); // from, dist
	auto f = [](pair<int_pair, size_t> x, pair<int_pair, size_t> y)
	{
		return x.second > y.second;
	};
	std::priority_queue<pair<int_pair, size_t>, vector<pair<int_pair, size_t>>, decltype(f)> q(f);
	// vertex(from, to); distance
	q.push({ {start, start}, 0 });

	while (!q.empty())
	{
		auto vertex = q.top();
		q.pop();
		if (distance[vertex.first.second].second < infinty) // vertex already used
			continue;
		distance[vertex.first.second] = int_pair(vertex.first.first, vertex.second);
		for (auto& u : outgoingEdges[vertex.first.second])
			if (distance[u.first].second == infinty)
				q.push({ {vertex.first.second, u.second}, vertex.second + u.second });
	}
	//for (int d : distance)
	//	cout << d << " ";
	return distance;
}

void floyd()
{
	// reading
	size_t n;
	cin >> n;
	vector<vector<int>> matrix(n, vector<int>(n));
	for (size_t i = 0; i < n; ++i)
		for (size_t j = 0; j < n; ++j)
			cin >> matrix[i][j];
	//

	for (size_t k = 0; k < n; ++k)
		for (size_t i = 0; i < n; ++i)
			for (size_t j = 0; j < n; ++j)
				matrix[i][j] = _Min_value(matrix[i][j], matrix[i][k] + matrix[k][j]);
}

void read_data(const string& file_name)
{
	size_t n, e;
	ifstream in(file_name);
	in >> n >> e;
	outgoingEdges = vector<vector<int_pair>>(n);
	for (size_t i = 0; i < e; ++i)
	{
		size_t v, u, d;
		in >> v >> u >> d;
		outgoingEdges[v].push_back({ u, d });
		//outgoingEdges[u].push_back({ v, d });
	}
}

size_t lenght_tree_of_shortest_path(const vector<int_pair>& distance, vector<size_t> objects)
{
	vector<bool> used(distance.size(), false);
	size_t lenght = 0;
	stack<size_t> stack;
	for (size_t v : objects)
		stack.push(v);
	while (!stack.empty())
	{
		size_t v = stack.top();
		stack.pop();
		if (used[v])
			continue;
		used[v] = true;
		lenght += distance[v].second;
		stack.push(distance[v].first);
	}
	return lenght;
}

void task_1()
{
	vector<vector<size_t>> to_fixed_objects;
	vector<vector<size_t>> from_fixed_objects;
	// 1a
	for (size_t object : fixed_objects)
		from_fixed_objects.push_back(dijkstra(object));

	for (size_t object : no_fixed_objects)
		to_fixed_objects.push_back(dijkstra(object));

	vector<vector<size_t>> to_from(fixed_objects.size(), vector<size_t>(no_fixed_objects.size()));

	for (size_t i = 0; i < fixed_objects.size(); ++i)
		for (size_t j = 0; j < no_fixed_objects.size(); ++j)
			to_from[i][j] = to_fixed_objects[no_fixed_objects[j]][fixed_objects[i]] + from_fixed_objects[fixed_objects[i]][no_fixed_objects[j]];
	// 1b
	size_t max_dist = 1234567;

	vector<size_t> nearest_objects_to;
	for (size_t i = 0; i < fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, to_fixed_objects[object][fixed_objects[i]]);
		if (max < max_dist)
			nearest_objects_to.push_back(fixed_objects[i]);
	}

	vector<size_t> nearest_objects_from;
	for (size_t i = 0; i < from_fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, from_fixed_objects[i][object]);
		if (max < max_dist)
			nearest_objects_from.push_back(fixed_objects[i]);
	}

	vector<size_t> nearest_objects_to_from;
	for (size_t i = 0; i < to_from.size(); ++i)
	{
		size_t max = 0;
		for (size_t dist : to_from[i])
			max = _Max_value(max, dist);
		if (max < max_dist)
			nearest_objects_to_from.push_back(fixed_objects[i]);
	}
	// 2
	size_t min_to = infinty;
	size_t index_to = 0;
	for (size_t i = 0; i < fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, to_fixed_objects[object][fixed_objects[i]]);
		if (max < min_to)
		{
			min_to = max;
			index_to = fixed_objects[i];
		}
	}

	size_t min_from = infinty;
	size_t index_from = 0;
	for (size_t i = 0; i < from_fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, from_fixed_objects[i][object]);
		if (max < min_from)
		{
			min_from = max;
			index_from = fixed_objects[i];
		}
	}

	size_t min_to_from = infinty;
	size_t index_to_from = 0;
	for (size_t i = 0; i < to_from.size(); ++i)
	{
		size_t max = 0;
		for (size_t dist : to_from[i])
			max = _Max_value(max, dist);
		if (max < min_to_from)
		{
			min_to_from = max;
			index_to_from = fixed_objects[i];
		}
	}
	// 3
	size_t min = infinty;
	size_t index = 0;
	for (size_t i = 0; i < from_fixed_objects.size(); ++i)
	{
		size_t sum = 0;
		for (size_t object : no_fixed_objects)
			sum += from_fixed_objects[i][object];
		if (sum < min)
		{
			min = sum;
			index = fixed_objects[i];
		}
	}
	// 4 - too hard now, do later
	vector<vector<int_pair>> from_fixed_objects_with_path;
	min = infinty;
	index = 0;
	for (size_t object : fixed_objects)
	{
		auto distance = dijkstra_path(object);
		from_fixed_objects_with_path.push_back(distance);
		size_t lenght = lenght_tree_of_shortest_path(distance, no_fixed_objects);
		if (min > lenght)
		{
			min = lenght;
			index = object;
		}
	}
}

float_pair coord(size_t v)
{
	return float_pair(0, 0);
}
double dist(float_pair l, float_pair r)
{
	return (l.first - r.first) * (l.first - r.first) + (l.second - r.second) * (l.second - r.second);
}
size_t get_nearest_vertex(float_pair vec)
{
	double distance = std::numeric_limits<double>::max();
	size_t res = 0;
	for (size_t j = 0; j < outgoingEdges.size(); ++j)
	{
		double cur_dist = dist(vec, coord(j));
		if (distance > cur_dist)
		{
			distance = cur_dist;
			res = j;
		}
	}
	return res;
}

float_pair operator*(float_pair l, float_pair r)
{
	return float_pair(l.first * r.first, l.second * r.second);
}
float_pair operator+(float_pair l, float_pair r)
{
	return float_pair(l.first + r.first, l.second + r.second);
}
float_pair operator/(float_pair p, double d)
{
	return float_pair(p.first / d, p.second / d);
}
float_pair operator*(float_pair p, double d)
{
	return float_pair(p.first * d, p.second * d);
}

int_pair nearest_clusters(const vector<float_pair>& centroides)
{
	double min = std::numeric_limits<double>::max();
	int_pair res;
	for (size_t i = 0; i < centroides.size(); ++i)
		for (size_t j = i + 1; j < centroides.size(); ++j)
		{
			double cur = dist(centroides[i], centroides[j]);
			if (cur < min)
			{
				min = cur;
				res.first = i;
				res.second = j;
			}
		}
	return res;
}

auto clustering(size_t k)
{
	vector<vector<size_t>> clusters(no_fixed_objects.size(), vector<size_t>(1));
	vector<float_pair> centroides(no_fixed_objects.size());

	for (size_t i = 0; i < no_fixed_objects.size(); ++i)
	{
		clusters[i][0] = no_fixed_objects[i];
		centroides[i] = coord(no_fixed_objects[i]);
	}

	while (clusters.size() > k)
	{
		auto pair = nearest_clusters(centroides);
		centroides[pair.first] = (centroides[pair.first] * clusters[pair.first].size() +
			centroides[pair.second] * clusters[pair.second].size()) / (clusters[pair.first].size() + clusters[pair.second].size());

		for (auto node : clusters[pair.second])
			clusters[pair.first].push_back(node);

		clusters.erase(clusters.begin() + pair.second);
	}
	return pair<vector<vector<size_t>>, vector<float_pair>>(clusters, centroides);
}

vector<size_t> get_centroids(const vector<float_pair>& centroides)
{
	vector<size_t> res(centroides.size(), 0);
	for (size_t i = 0; i < centroides.size(); ++i)
		res[i] = get_nearest_vertex(centroides[i]);
	return res;
}

void task_2()
{
	size_t k = 5;
	size_t obj = fixed_objects.front();
	auto distance = dijkstra_path(obj);
	auto pair = clustering(k);
	auto clusters = pair.first;
	auto centroids = get_centroids(pair.second);

	size_t lenght = lenght_tree_of_shortest_path(distance, no_fixed_objects);

	size_t sum_lenght = lenght_tree_of_shortest_path(distance, centroids);
	for (size_t i = 0; i < clusters.size(); i++)
		sum_lenght += lenght_tree_of_shortest_path(dijkstra_path(centroids[i]), clusters[i]);
}

int main()
{
	string file_name = "file_name";
	read_data(file_name);
}